import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create a new user',
    flags: [
        { key: 'user', desc: 'Username' },
        { key: 'password', desc: 'Password' },
        { key: 'email', desc: 'Email' },
    ],
};

export async function execute(context) {
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input', default: 'admin', required: true },
        { key: 'password', name: 'Password', type: 'password', required: true },
        { key: 'email', name: 'Email', type: 'email' }
    ]);

    // TODO add user to db

    console.log('result', result)
}
