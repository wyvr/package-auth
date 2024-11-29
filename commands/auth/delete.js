import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Delete a user',
    flags: [
        { key: 'user', desc: 'Username' },
    ],
};

export async function execute(context) {
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input', required: true },
    ]);

    // TODO delete user from db

    console.log('result', result)
}
