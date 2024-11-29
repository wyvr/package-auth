import { execute_flag_prompts } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create new role',
    flags: [
        { key: 'role', desc: 'role' },
        { key: 'name', desc: 'Name' }
    ],
};

export async function execute(context) {
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'role', name: 'Role', type: 'input', required: true },
        { key: 'name', name: 'Name', type: 'input', required: true }
    ]);

    // TODO create role in db

    console.log('result', result)
}
