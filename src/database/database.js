import Database from 'better-sqlite3';

export function create_connection(file) {
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

