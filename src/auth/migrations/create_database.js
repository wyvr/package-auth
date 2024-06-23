import { run } from '@src/database/database.js';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export default function (db) {
    const query = readFileSync(
        join(
            dirname(import.meta.url).replace('file:', ''),
            './create_database.sql'
        ),
        'utf-8'
    );
    run(db, query);
    try {
        run(db, 'CREATE INDEX idx_user_email ON user (email);');
    } catch (_) {
        // pass
    }
}
