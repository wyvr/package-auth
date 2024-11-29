import { prompt_input, add_prompts, execute_prompts, validate } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Create new role',
    flags: [
        { key: 'role', desc: 'role' },
        { key: 'name', desc: 'Name' }
    ],
};

export async function execute(context) {
    const flags = context?.cli?.flags;
    const fields = ['role', 'name'];
    const names = ['Role', 'Name'];

    let result = {};

    for (const [i, field] of fields.entries()) {
        const validate_fn = validate.required;
        const init_value = flags?.[field];
        if (init_value && validate_fn(init_value) === true) {
            logger.info(names[i], init_value);
            result[field] = init_value;
        } else {
            add_prompts(
                prompt_input(field, names[i], null, validate_fn)
            )
        }
    }
    result = await execute_prompts(result);

    // TODO create role in db

    console.log('result', result)
}
