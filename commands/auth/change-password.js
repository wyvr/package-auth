import { prompt_input, add_prompts, execute_prompts, validate } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Change password of user',
    flags: [
        { key: 'user', desc: 'Username' },
        { key: 'password', desc: 'Password' }
    ],
};

export async function execute(context) {
    const flags = context?.cli?.flags;
    const fields = ['user', 'password'];
    const names = ['Username', 'Password'];

    let result = {};

    for (const [i, field] of fields.entries()) {
        const validate_fn = validate.required;
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
                prompt_input(field, names[i], null, validate_fn)
            )
        }
    }
    result = await execute_prompts(result);

    // TODO change password of user in db

    console.log('result', result)
}
