import { getConnection } from '$src/auth/database';
import { getUserByName, getSafeUserByName, deleteUserLogins } from '$src/auth/resource/user.js';
import { getAll, run } from '$src/database/database.js';
import { TOKEN_LIFETIME_MINUTES } from '$src/auth/constants.js';
import { get_config } from 'wyvr/cron.js';
import { getPasswordHash } from '$src/auth/resource/password.js';

export function login(name, password) {
    const user = getUserByName(name);
    if (!user) {
        return null;
    }
    if (user.hash !== getPasswordHash(password, user.salt)) {
        return null;
    }
    const token = createToken(user);
    if (!token) {
        return null;
    }
    try {
        const db = getConnection();
        deleteUserLogins(name);
        run(db, 'INSERT INTO login (name, token) VALUES ($name, $token);', { name, token });
        return { token, user: getSafeUserByName(name) };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function logout(name, token) {
    const valid = isTokenValid(name, token);
    if (!valid) {
        return false;
    }
    return deleteUserLogins(name);
}

export function getUser(name, token) {
    const valid = isTokenValid(name, token);
    if (!valid) {
        return null;
    }
    try {
        // update the created date of the token
        const db = getConnection();
        run(db, `UPDATE login SET created = datetime('now') WHERE name = $name AND token = $token;`, { name, token });
        const user = getSafeUserByName(name);
        return {
            name: user.name,
            email: user.email,
            role: user.role
        };
    } catch (error) {
        console.error(error);
        return null;
    }
}

export function isTokenValid(name, token) {
    try {
        const db = getConnection();
        const minutes = get_config('auth.token_lifetime_minutes', TOKEN_LIFETIME_MINUTES);
        const login = run(db, `SELECT token FROM login WHERE name = $name AND token = $token AND created > datetime('now', '-${minutes} minute');`, { name, token });
        if (!login) {
            return false;
        }
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function getLogins(name) {
    const db = getConnection();
    const minutes = get_config('auth.token_lifetime_minutes', TOKEN_LIFETIME_MINUTES);
    return getAll(db, `SELECT token, created FROM login WHERE name = $name AND created > datetime('now', '-${minutes} minute');`, { name });
}

export function getToken(name) {
    const user = getUserByName(name);
    if (!user) {
        return null;
    }
    return createToken(user);
}

export function createToken(user) {
    try {
        const date = new Date().getTime();
        const content = JSON.stringify({
            name: user.name,
            email: user.email,
            created: date
        });
        return getPasswordHash(content, date.toString());
    } catch (error) {
        console.error(error);
        return null;
    }
}
