import { get_connection, apply_migrations } from '@src/auth/database.js';
export default async function () {
    const db = get_connection();
    await apply_migrations(db);
}
