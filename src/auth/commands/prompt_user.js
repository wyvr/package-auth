import { getUserByName } from '$src/auth/resource/user.js';
import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export async function promptUser(context) {
    let user;
    let flags = context?.cli?.flags;
    while (!user) {
        // prompt for name
        const name_result = await execute_flag_prompts(flags, [
            { key: 'name', name: 'Username', type: 'input', required: true }
        ]);
        flags = {};
        // load user from db
        const result_user = getUserByName(name_result.name);
        if (!result_user) {
            logger.error('User does not exist');
        }
        if (result_user && result_user?.name === name_result.name) {
            user = result_user;
        }
    }
    return user;
}
