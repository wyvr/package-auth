import { getRolesAsPrompt } from '$src/auth/resource/role.js';
import { createUser } from '$src/auth/resource/user.js';
import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create a new user',
    flags: [
        { key: 'name', desc: 'Username' },
        { key: 'password', desc: 'Password' },
        { key: 'email', desc: 'Email' },
        { key: 'role', desc: 'Role' },
    ],
};

export async function execute(context) {
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'name', name: 'Username', type: 'input', default: 'admin', required: true },
        { key: 'password', name: 'Password', type: 'password', required: true },
        { key: 'email', name: 'Email', type: 'email' },
        { key: 'role', name: 'Role', type: 'list', required: true, list: getRolesAsPrompt() }
    ]);

    // add user to db
    const create_result = createUser(result);
    
    if (!create_result) {
        logger.error('Failed to create user');
        return;
    }

    logger.success('User created');
}

