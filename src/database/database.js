import Database from 'better-sqlite3';

export function createConnection(file) {
    if (typeof file !== 'string' || file.split('.').pop() !== 'db') {
        return undefined;
    }
    const db = new Database(file);
    db.pragma('foreign_keys=ON');
    db.pragma('journal_mode=WAL');
    db.pragma('synchronous=NORMAL');
    db.pragma('busy_timeout=5000');
    db.pragma('temp_store=MEMORY');
    db.pragma('mmap_size=134217728');
    db.pragma('journal_size_limit=67108864');
    db.pragma('cache_size=2000');
    return db;
}

export function run(db, sql, data) {
    return execute('run', db, sql, data);
}
export function getFirst(db, sql, data) {
    return execute('get', db, sql, data);
}
export function getAll(db, sql, data) {
    return execute('all', db, sql, data);
}

function execute(type, db, sql, data) {
    const stmt = db.prepare(sql);
    if (stmt[type] === undefined) {
        return undefined;
    }
    if (data === undefined) {
        return stmt[type]();
    }
    return stmt[type](data);
}
