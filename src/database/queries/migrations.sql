CREATE TABLE
    IF NOT EXISTS migrations (
        name TEXT STRICT UNIQUE,
        applied TEXT DEFAULT (CURRENT_TIMESTAMP)
    );