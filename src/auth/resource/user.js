import { getConnection } from '$src/auth/database.js';
import { run, getFirst, getDate, getAll } from '$src/database/database.js';
import { read } from 'wyvr/src/utils/file.js';
import { filled_string, filled_object } from 'wyvr/src/utils/validate.js';
import { Cwd } from 'wyvr/src/vars/cwd.js';
import { FOLDER_GEN_SERVER } from 'wyvr/src/constants/folder.js';
import { createSalt, getPasswordHash } from '$src/auth/resource/password.js';

export function createUser(data) {
    if (!data?.name || !data?.password || !data?.email || !data?.role) {
        return false;
    }
    const query = read(Cwd.get(FOLDER_GEN_SERVER, 'auth/query/create_user.sql'));
    if (!query) {
        return false;
    }

    const salt = createSalt();
    return run(getConnection(), query, { name: data.name, email: data.email, role: data.role, hash: getPasswordHash(data.password, salt), salt, active: 1 });
}
export function getUserByName(name) {
    if (!filled_string(name)) {
        return null;
    }
    const query = read(Cwd.get(FOLDER_GEN_SERVER, 'auth/query/get_user_by_name.sql'));
    if (!query) {
        return false;
    }
    return getFirst(getConnection(), query, { name });
}
export function getSafeUserByName(name) {
    if (!filled_string(name)) {
        return null;
    }
    const query = read(Cwd.get(FOLDER_GEN_SERVER, 'auth/query/get_safe_user_by_name.sql'));
    if (!query) {
        return false;
    }
    return getFirst(getConnection(), query, { name });
}
export function updateUserByName(name, data) {
    if (!filled_string(name) || !filled_object(data)) {
        return false;
    }
    data.updated = getDate();
    const fields = ['name', 'email', 'role', 'hash', 'salt', 'locked_until', 'active', 'updated'];
    const update_values = fields
        .map((key) => (key in data && data[key] !== undefined ? `${key} = :${key}` : undefined))
        .filter(Boolean)
        .join(', ');
    if (!update_values) {
        return false;
    }
    const query = `UPDATE user SET ${update_values} WHERE name = :id;`;
    return run(getConnection(), query, { ...data, id: name });
}
export function updatePasswordOfUser(name, password) {
    if (!filled_string(name) || !filled_string(password)) {
        return false;
    }
    const query = read(Cwd.get(FOLDER_GEN_SERVER, 'auth/query/update_password.sql'));
    if (!query) {
        return false;
    }
    const salt = createSalt();
    return run(getConnection(), query, { name, hash: getPasswordHash(password, salt), salt, updated: getDate() });
}
export function deleteUserByName(name) {
    if (!filled_string(name)) {
        return null;
    }
    const query = read(Cwd.get(FOLDER_GEN_SERVER, 'auth/query/delete_user_by_name.sql'));
    if (!query) {
        return false;
    }
    return run(getConnection(), query, { name });
}
export function getAllUsers() {
    return getAll(getConnection(), 'SELECT name, email, created, updated, locked_until, active FROM user;');
}
export function deleteUserLogins(name) {
    if (!filled_string(name)) {
        return null;
    }
    run(getConnection(), 'DELETE FROM login WHERE name = $name;', { name });
}
