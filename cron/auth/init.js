import { getConnection, getPath } from '$src/auth/database.js';
import { Migrations } from 'wyvr/storage.js';

export default async function () {
    const db = getConnection();
    const migrations = new Migrations(getPath(), 'auth/migrations');
    await migrations.apply();
}
