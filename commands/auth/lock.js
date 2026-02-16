import { promptUser } from '$src/auth/commands/prompt_user.js';
import { deleteUserLogins, updateUserByName } from '$src/auth/resource/user.js';
import { getDate } from '$src/database/database.js';
import { execute_flag_prompts } from 'wyvr/commands';
import { logger } from 'wyvr/universal';

export const meta = {
    desc: 'Lock a user',
    flags: [
        { key: 'name', desc: 'Username' },
        { key: 'duration', desc: 'Duration in minutes' }
    ]
};

export async function execute(context) {
    const user = await promptUser(context);
    let duration;
    let flags = context?.cli?.flags;
    flags = context?.cli?.flags;
    while (!duration) {
        // prompt for id
        const duration_result = await execute_flag_prompts(flags, [{ key: 'duration', name: 'Duration in minutes', type: 'number', default: 60, required: true }]);
        flags = {};

        if (duration_result?.duration) {
            duration = duration_result.duration;
        }
    }

    // logout every login of user
    deleteUserLogins(user.name);

    // update user in db
    const update_result = updateUserByName(user.name, { locked_until: getDate(new Date().getTime() + Number.parseFloat(duration) * 60 * 1000) });
    if (!update_result) {
        logger.error('Failed to lock user');
        return;
    }
    logger.success('User locked');
}
