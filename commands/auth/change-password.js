import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Change password of user',
    flags: [
        { key: 'user', desc: 'Username' },
        { key: 'password', desc: 'Password' }
    ],
};

export async function execute(context) {
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input', default: 'admin', required: true },
        { key: 'password', name: 'Password', type: 'password', required: true },
    ]);

    // TODO change password of user in db

    console.log('result', result)
}
