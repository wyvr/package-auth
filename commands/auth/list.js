import { getAllUsers } from '$src/auth/resource/user.js';
import { logger } from 'wyvr/universal.js';
import { filled_array } from 'wyvr/src/utils/validate.js';

export const meta = {
    desc: 'List all users',
    flags: [],
};

export async function execute() {
    const result = getAllUsers();

    if (!result) {
        logger.error('Failed to list users');
        return;
    }
    if(!filled_array(result)) {
        logger.warning('No users found');
        return;
    }

    console.table(result);
}
