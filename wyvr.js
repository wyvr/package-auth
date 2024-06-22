export default {
    cron: {
        auth_init: {
            when: '@build',
            what: ['auth/init.js'],
        },
    },
    auth: {},
    _secrets: {
        auth: {},
    },
};
