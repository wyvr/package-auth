import { promptUser } from '$src/auth/commands/prompt_user.js';
import { getRolesAsPrompt } from '$src/auth/resource/role.js';
import { updateUserByName } from '$src/auth/resource/user.js';
import { execute_flag_prompts, prompt_option } from 'wyvr/commands.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Change role of user',
    flags: [
        { key: 'name', desc: 'Username' },
        { key: 'role', desc: 'Role' }
    ]
};

export async function execute(context) {
    const user = await promptUser(context);

    const result = await execute_flag_prompts(context?.cli?.flags, [{ key: 'role', name: 'Role', type: 'list', required: true, list: getRolesAsPrompt() }]);

    updateUserByName(user.name, { role: result.role });
    logger.success('Role has been changed');
}
