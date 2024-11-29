CREATE TABLE
    IF NOT EXISTS migrations (
        file TEXT STRICT UNIQUE,
        applied TEXT DEFAULT (CURRENT_TIMESTAMP)
    );