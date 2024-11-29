CREATE TABLE
    IF NOT EXISTS user (
        name TEXT,
        email TEXT NOT NULL UNIQUE,
        created DATETIME DEFAULT (CURRENT_TIMESTAMP),
        role INTEGER DEFAULT 0,
        hash TEXT,
        salt TEXT,
        locked_until DATETIME,
        active INTEGER DEFAULT 0
    );
