import { getConnection } from '$src/auth/database.js';
import { applyMigrations } from '$src/database/migrations.js';

export default async function () {
    const db = getConnection();
    await applyMigrations(db, 'auth/migrations');
}
