CREATE TABLE
    IF NOT EXISTS login (
        name TEXT NOT NULL,
        token TEXT NOT NULL,
        created DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );