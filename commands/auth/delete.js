import { promptUser } from '$src/auth/commands/prompt_user.js';
import { deleteUserByName } from '$src/auth/resource/user.js';
import { logger } from 'wyvr/universal.js';

export const meta = {
    desc: 'Delete a user',
    flags: [{ key: 'name', desc: 'Username' }]
};

export async function execute(context) {
    const user = await promptUser(context);

    deleteUserByName(user.name);
    logger.success('User deleted');
}
