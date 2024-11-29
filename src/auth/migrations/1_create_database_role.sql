CREATE TABLE
    IF NOT EXISTS role (
        name TEXT,
        created DATETIME DEFAULT (CURRENT_TIMESTAMP)
    );