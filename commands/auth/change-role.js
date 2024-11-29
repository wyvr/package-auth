import { prompt_input, prompt_list, prompt_option, add_prompts, execute_prompts, validate } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Change role of user',
    flags: [
        { key: 'user', desc: 'Username' },
        { key: 'role', desc: 'Role' }
    ],
};

export async function execute(context) {
    const flags = context?.cli?.flags;
    const fields = ['user', 'role'];
    const names = ['Username', 'Role'];

    let result = {};

    if (flags?.user) {
        logger.info('Username', flags.user);
        result.user = flags.user;
    } else {
        add_prompts(
            prompt_input('user', 'Username', null, validate.required)
        )
    }

    // load roles from the db

    if (flags?.role) {
        logger.info('Role', flags.role);
        result.role = flags.role;
    } else {
        add_prompts(
            prompt_list('role', 'Role', [prompt_option('admin', 'Admin'), prompt_option('user', 'User')])
        )
    }

    result = await execute_prompts(result);

    // TODO change password of user in db

    console.log('result', result)
}
