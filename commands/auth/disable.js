import { promptUser } from '$src/auth/commands/prompt_user.js';
import { deleteUserLogins, updateUserByName } from '$src/auth/resource/user.js';
import { logger } from 'wyvr/universal';

export const meta = {
    desc: 'Disable a user',
    flags: [{ key: 'name', desc: 'Username' }]
};

export async function execute(context) {
    const user = await promptUser(context);

    // logout every login
    deleteUserLogins(user.name);

    // update user in db
    const update_result = updateUserByName(user.name, { active: 0 });
    if (!update_result) {
        logger.error('Failed to disable user');
        return;
    }
    logger.success('User disable');
}
