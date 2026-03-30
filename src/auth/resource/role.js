import { prompt_option } from 'wyvr/cli';

export function getRoles() {}
export function getRolesAsPrompt() {
    return [prompt_option('admin', 'Admin'), prompt_option('user', 'User')];
}
export function createRole(name, role) {
    console.log('createRole', name, role);
}
