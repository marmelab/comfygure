module.exports = {
    logs: {
        debug: false,
    },
    db: {
        client: {
            user: 'postgres',
            password: '',
            database: 'comfy',
            host: 'localhost',
            port: 5432,
        },
        pooling: {
            max: 10,
            idleTimeoutMillis: 30000,
        },
    },
};
