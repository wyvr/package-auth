import { prompt_option } from 'wyvr/commands';

export function getRoles() {}
export function getRolesAsPrompt() {
    return [prompt_option('admin', 'Admin'), prompt_option('user', 'User')];
}
export function createRole(name, role) {
    console.log('createRole', name, role);
}
