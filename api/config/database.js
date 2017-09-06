const config = require('config');

const databaseConfig = Object.assign({}, { driver: 'pg' }, config.db.client);

if (process.env.PGHOST) {
    databaseConfig.host = process.env.PGHOST;
}

if (process.env.PGPORT) {
    databaseConfig.port = process.env.PGPORT;
}

if (process.env.PGDATABASE) {
    databaseConfig.database = process.env.PGDATABASE;
}

if (process.env.PGUSER) {
    databaseConfig.user = process.env.PGUSER;
}

if (process.env.PGPASSWORD) {
    databaseConfig.password = process.env.PGPASSWORD;
}

// dev is the configuration by default, using config to change the conf based on NODE_ENV value
module.exports = { dev: databaseConfig };
