SELECT name, email, role
    FROM user 
    WHERE name = $name 
        AND active = 1 
        AND (
            locked_until IS NULL 
            OR locked_until < datetime('now')
        ) 
    LIMIT 1;