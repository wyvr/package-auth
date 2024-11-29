import { prompt_input, add_prompts, execute_prompts, validate, execute_flag_prompts } from 'wyvr/commands.js';
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
    const flags = context?.cli?.flags;
    const fields = ['user', 'password', 'email'];
    const names = ['Username', 'Password', 'Email'];
    const default_values = ['admin', null, null];

    const result = await execute_flag_prompts(context?.cli?.flags, [
        { key: 'user', name: 'Username', type: 'input', required: true },
        { key: 'password', name: 'Password', type: 'password', required: true },
        { key: 'email', name: 'Email', type: 'email' }
    ]);

    for (const [i, field] of fields.entries()) {
        const validate_fn = field === 'email' ? validate.email : validate.required;
        const init_value = flags?.[field];
        if (init_value && validate_fn(init_value) === true) {
            if (field === 'password') {
                logger.warning('Providing password via command line is not recommended');
                logger.info(names[i], '***');
            } else {
                logger.info(names[i], init_value);
            }
            result[field] = init_value;
        } else {
            add_prompts(
                prompt_input(field, names[i], default_values[i], validate_fn)
            )
        }
    }
    result = await execute_prompts(result);

    // TODO add user to db

    console.log('result', result)
}
