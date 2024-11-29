import { collect_files } from 'wyvr/src/utils/file.js';
import {
    filled_array,
    filled_string,
    is_func,
} from 'wyvr/src/utils/validate.js';
import { Cwd } from 'wyvr/src/vars/cwd.js';
import { FOLDER_GEN_SERVER } from 'wyvr/src/constants/folder.js';
import { logger, get_error_message } from 'wyvr/universal.js';
import { basename, dirname, join } from 'node:path';
import { run, getAll } from '$src/database/database.js';
import { readFileSync } from 'node:fs';

export async function applyMigrations(db, folder) {
    const files = getMigrationFiles(folder);
    if (!filled_array(files)) {
        logger.warning('no migrations found in', folder);
        return [];
    }
    const migrations = getAppliedMigrations(db);
    const files_to_apply = getFilesToApply(files, migrations);
    const applied_migrations = await applyFiles(db, files_to_apply);
    if (applied_migrations.length === 0) {
        logger.warning('no migrations applied');
    }
    return applied_migrations;
}

export function getMigrationFiles(folder) {
    if (!filled_string(folder)) {
        return [];
    }
    const target = Cwd.get(FOLDER_GEN_SERVER, folder);
    const files = collect_files(target, '.js');
    if (!filled_array(files)) {
        return [];
    }
    return files;
}

export function getAppliedMigrations(db) {
    if (!db) {
        return [];
    }
    try {
        return getAll(db, 'SELECT * FROM migrations');
    } catch (_) {
        return [];
    }
}

export function getFilesToApply(files, migrations) {
    const migrations_names = migrations.map((row) => row.name).filter(Boolean);
    return files
        .map((file) => {
            if (!filled_string(file)) {
                return undefined;
            }
            const name = basename(file, '.js');
            if (!migrations_names.includes(name)) {
                return file;
            }
            return undefined;
        })
        .filter(Boolean);
}
export async function applyFiles(db, files) {
    run(db, get_query('./queries/migrations.sql'));
    if (!filled_array(files)) {
        return [];
    }
    const applied_migrations = [];
    for (const file of files) {
        const name = basename(file, '.js');
        let fn;
        try {
            const module = await import(file);
            fn = module?.default;
        } catch (e) {
            logger.error(get_error_message(e, file, 'migration'));
            continue;
        }
        if (!is_func(fn)) {
            continue;
        }
        try {
            fn(db);
            run(db, get_query('./queries/migration_insert.sql'), {
                name,
            });
        } catch (e) {
            logger.error(get_error_message(e, file, 'migration'));
            continue;
        }
        logger.info('applied migration', name);
        applied_migrations.push(name);
    }
    return applied_migrations;
}

function get_query(path) {
    return readFileSync(
        join(dirname(import.meta.url).replace('file:', ''), path),
        'utf-8'
    );
}
