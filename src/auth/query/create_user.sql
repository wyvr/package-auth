INSERT INTO user
    (name, email, role, hash, salt, active) 
    VALUES ($name, $email, $role, $hash, $salt, $active);