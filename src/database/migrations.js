import { collect_files } from '@wyvr/generator/src/utils/file.js';
import {
    filled_array,
    filled_string,
    is_func,
} from '@wyvr/generator/src/utils/validate.js';
import { Cwd } from '@wyvr/generator/src/vars/cwd.js';
import { FOLDER_GEN_SERVER } from '@wyvr/generator/src/constants/folder.js';
import { logger, get_error_message } from '@wyvr/generator/universal.js';

import { basename } from 'node:path';

export function get_migration_files(folder) {
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

export function get_applied_migrations(db) {
    if (!db) {
        return [];
    }
    try {
        const stmt = db.prepare('SELECT * FROM migrations');
        return stmt.all();
    } catch (_) {
        return [];
    }
}

export function get_files_to_apply(files, migrations) {
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
export async function apply_files(db, files) {
    const stmt = db.prepare(`CREATE TABLE IF NOT EXISTS migrations (
    name TEXT,
    applied DATETIME DEFAULT (CURRENT_DATETIME)
);`);
    stmt.run();
    console.log('migrations', files);
    for (const file of files) {
        const name = basename(file, '.js');
        const module = await import(file);
        console.log(module);
        const fn = module?.default;
        if (!is_func(fn)) {
            continue;
        }
        try {
            fn(db);
        } catch (e) {
            logger.error(get_error_message(e, file, 'migration'));
            continue;
        }
        const stmt = db.prepare('INSERT INTO migrations (name) VALUES (?)');
        stmt.run(name);
        logger.info(`Applied migration ${name}`);
    }
}
