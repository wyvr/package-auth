import { prompt_option } from 'wyvr/commands.js';

export function getRoles() {

}
export function getRolesAsPrompt() {
    return [prompt_option('admin', 'Admin'), prompt_option('user', 'User')]
}
