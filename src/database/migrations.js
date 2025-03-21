import { collect_files, read } from 'wyvr/src/utils/file.js';
import { filled_array, filled_string, is_func } from 'wyvr/src/utils/validate.js';
import { Cwd } from 'wyvr/src/vars/cwd.js';
import { FOLDER_GEN_SERVER } from 'wyvr/src/constants/folder.js';
import { logger, get_error_message } from 'wyvr/universal.js';
import { basename, dirname, extname, join } from 'node:path';
import { run, getAll } from '$src/database/database.js';
import { readFileSync } from 'node:fs';

export async function applyMigrations(db, folder) {
    const files = getMigrationFiles(folder);
    if (!filled_array(files)) {
        logger.warning('no migrations found in', folder);
        return [];
    }
    const migrations = getAppliedMigrations(db);
    const files_to_apply = getFilesToApply(files, migrations, folder);
    const applied_migrations = await applyFiles(db, files_to_apply, folder);
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
    const files = collect_files(target).filter((file) => file.endsWith('.js') || file.endsWith('.sql'));
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

export function getFilesToApply(files, migrations, folder) {
    const migrations_files = migrations.map((row) => row.file).filter(Boolean);
    return files
        .map((file) => {
            if (!filled_string(file)) {
                return undefined;
            }
            const rel_file = file.replace(Cwd.get(FOLDER_GEN_SERVER, folder), '');
            if (!migrations_files.includes(rel_file)) {
                return file;
            }
            return undefined;
        })
        .filter(Boolean);
}
export async function applyFiles(db, files, folder) {
    run(db, get_query('./query/migrations.sql'));
    if (!filled_array(files)) {
        return [];
    }
    const applied_migrations = [];
    const target = Cwd.get(FOLDER_GEN_SERVER, folder);

    for (const file of files) {
        let applied = false;
        try {
            switch (extname(file)) {
                case '.js': {
                    const module = await import(file);
                    const fn = module?.default;
                    if (!is_func(fn)) {
                        continue;
                    }
                    fn(db);
                    applied = true;
                    break;
                }
                case '.sql': {
                    const query = read(file);
                    if (!query) {
                        continue;
                    }
                    run(db, query);
                    applied = true;
                    break;
                }
            }
            run(db, get_query('./query/migration_insert.sql'), {
                file: file.replace(target, '')
            });
        } catch (e) {
            logger.error(get_error_message(e, file, 'migration'));
            continue;
        }
        if (applied) {
            logger.info('applied migration', file);
            applied_migrations.push(file);
        }
    }
    return applied_migrations;
}

function get_query(path) {
    return readFileSync(join(dirname(import.meta.url).replace('file:', ''), path), 'utf-8');
}
