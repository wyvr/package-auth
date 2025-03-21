import { getConnection } from '$src/auth/database.js';
import { getAll, run } from '$src/database/database.js';
import { get_config } from 'wyvr/cron.js';
import { logger } from 'wyvr/universal.js';
import { TOKEN_LIFETIME_MINUTES } from '$src/auth/constants.js';

export default async function () {
    const db = getConnection();
    const minutes = get_config('auth.token_lifetime_minutes', TOKEN_LIFETIME_MINUTES);
    const result = run(db, `DELETE FROM login WHERE created < datetime('now', '-${minutes} minute');`);

    logger.success('auth/cleanup_login', result?.changes, 'logins deleted that are older then', minutes, 'minutes');
}
