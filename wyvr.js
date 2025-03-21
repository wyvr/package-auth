export default {
    cron: {
        auth_init: {
            when: '@build',
            what: ['auth/init.js', 'auth/cleanup_login.js']
        },
        auth_cleanup: {
            when: '0 * * * *',
            what: ['auth/cleanup_login.js']
        }
    },
    auth: {
        token_lifetime_minutes: 60 // 1h
    },
    _secrets: {
        auth: {}
    }
};
