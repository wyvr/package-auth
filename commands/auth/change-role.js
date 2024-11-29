import { execute_flag_prompts, prompt_option } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Change role of user',
    flags: [
        { key: 'user', desc: 'Username' },
        { key: 'role', desc: 'Role' }
    ],
};

export async function execute(context) {
    // load roles from the db
    const list = [prompt_option('admin', 'Admin'), prompt_option('user', 'User')];   
    
    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input', required: true },
        { key: 'role', name: 'Role', type: 'list', required: true, list }
    ]);


    // TODO change password of user in db

    console.log('result', result)
}
