import { promptUser } from '$src/auth/commands/prompt_user.js';
import { updateUserByName } from '$src/auth/resource/user.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Enable a user',
    flags: [{ key: 'name', desc: 'Username' }]
};

export async function execute(context) {
    const user = await promptUser(context);

    // update user in db
    const update_result = updateUserByName(user.name, { active: 1 });
    if (!update_result) {
        logger.error('Failed to enable user');
        return;
    }
    logger.success('User enabled');
}
