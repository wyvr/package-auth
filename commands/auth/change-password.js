import { promptUser } from '$src/auth/commands/prompt_user.js';
import { updatePasswordOfUser } from '$src/auth/resource/user.js';
import { execute_flag_prompts } from 'wyvr/commands';
import { logger } from 'wyvr/universal';

export const meta = {
    desc: 'Change password of user',
    flags: [
        { key: 'name', desc: 'Username' },
        { key: 'password', desc: 'Password' }
    ]
};

export async function execute(context) {
    const user = await promptUser(context);

    const password = await execute_flag_prompts(context?.cli?.flags, [{ key: 'password', name: 'Password', type: 'password', required: true }]);

    // change password of user
    if (updatePasswordOfUser(user.name, password.password)) {
        logger.info('Password has been changed');
        return;
    }

    logger.error('Failed to change password');
}
