import { pbkdf2Sync, randomBytes } from 'node:crypto';

export function getPasswordHash(password, salt) {
    try {
        const key = pbkdf2Sync(password, salt, 100000, 64, 'sha512');
        return key.toString('hex');
    } catch (error) {
        console.error(error);
        return null;
    }
}  

export function createSalt() {
    return randomBytes(16).toString('hex');
}