import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create a new user',
    flags: [
        { key: 'id', desc: 'Identifier of the user(username)' },
        { key: 'user', desc: 'New username' },
        { key: 'password', desc: 'New password' },
        { key: 'email', desc: 'New email' },
    ],
};

export async function execute(context) {
    // prompt for id
    const id_result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'id', name: 'Identifier', type: 'input', required: true },
    ]);

    // load user from db
    const user = null;
    if (!user) {
        logger.error('User does not exist');
        return;
    }

    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input' },
        { key: 'password', name: 'Password', type: 'password' },
        { key: 'email', name: 'Email', type: 'email' }
    ]);

    // TODO update user in db

    console.log('result', id_result)
}
