CREATE TABLE
    IF NOT EXISTS user (
        name TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        created DATETIME DEFAULT (CURRENT_TIMESTAMP),
        updated DATETIME DEFAULT (CURRENT_TIMESTAMP),
        role INTEGER DEFAULT 0,
        hash TEXT,
        salt TEXT,
        locked_until DATETIME,
        active INTEGER DEFAULT 0
    );
