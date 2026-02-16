import { createRole } from '$src/auth/resource/role.js';
import { execute_flag_prompts } from 'wyvr/commands';
import { logger } from 'wyvr/universal';

export const meta = {
    desc: 'Create new role',
    flags: [
        { key: 'name', desc: 'Name' },
        { key: 'role', desc: 'role' }
    ]
};

export async function execute(context) {
    const name = await execute_flag_prompts(context?.cli?.flags, [{ key: 'name', name: 'Name', type: 'input', required: true }]);

    let role = name.name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_');
    if (context?.cli?.flags?.role) {
        role = context.cli.flags.role;
    }

    createRole(name.name, role);
    logger.success('Role created');
}
