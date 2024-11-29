import { prompt_input, add_prompts, execute_prompts, validate } from 'wyvr/commands.js';
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
    const flags = context?.cli?.flags;
    const fields = ['user', 'password', 'email'];
    const names = ['Username', 'Password', 'Email'];
    const default_values = ['admin', null, null];

    let id_result = {};
    let result = {};


    // promit for id
    let id = flags?.id;
    if (id) {
        logger.info('Identifier', id);
        id_result.id = id;
    } else {
        add_prompts(
            prompt_input('id', 'Identifier', null, validate.required)
        )
    }
    id = await execute_prompts(id_result);

    // load user from db
    const user = null;
    if (!user) {
        logger.error('User does not exist');
        return;
    }
    for (const [i, field] of fields.entries()) {
        const validate_fn = field === 'email' ? validate.email : null;
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

    // TODO update user in db

    console.log('result', id_result)
}
