import { getUserByName, updateUserByName } from '$src/auth/resource/user.js';
import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create a new user',
    flags: [
        { key: 'id', desc: 'Identifier of the user(username)' },
        { key: 'name', desc: 'New username' },
        { key: 'password', desc: 'New password' },
        { key: 'email', desc: 'New email' }
    ]
};

export async function execute(context) {
    let user;
    let flags = context?.cli?.flags;
    while (!user) {
        // prompt for id
        const id_result = await execute_flag_prompts(flags, [{ key: 'id', name: 'Identifier(name)', type: 'input', required: true }]);
        flags = {};
        // load user from db
        const result_user = getUserByName(id_result.id);
        if (!result_user) {
            logger.error('User does not exist');
        }
        if (result_user && result_user?.name === id_result.id) {
            user = result_user;
        }
    }

    logger.info('Leave empty to keep the existing value');

    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'name', name: 'Username', type: 'input' },
        { key: 'password', name: 'Password', type: 'password' },
        { key: 'email', name: 'Email', type: 'email' }
    ]);

    // find differences in the user
    const fields = ['name', 'password', 'email'];

    const updated_user = {};

    for (const field of fields) {
        if (result[field] && result[field] !== user[field]) {
            updated_user[field] = result[field];
        }
    }
    // update user in db
    const update_result = updateUserByName(user.name, updated_user);
    if (!update_result) {
        logger.error('Failed to update user');
        return;
    }
    logger.success('User updated');
}
