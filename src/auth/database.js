import { create_connection } from '@src/database/database.js';
import { Cwd } from '@wyvr/generator/src/vars/cwd.js';
import { FOLDER_CACHE } from '@wyvr/generator/src/constants/folder.js';
import { get_migration_files, get_applied_migrations, get_files_to_apply, apply_files } from '@src/database/migrations.js';

let connection;
const file = 'auth.db';
const path = Cwd.get(FOLDER_CACHE, file);

export function get_connection() {
    if (connection) {
        return connection;
    }
    connection = create_connection(path);
    return connection;
}

export async function apply_migrations(db) {
    const files = get_migration_files('auth/migrations');
    const migrations = get_applied_migrations(db);
    const files_to_apply = get_files_to_apply(files, migrations);
    await apply_files(db, files_to_apply);
}
