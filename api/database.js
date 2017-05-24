const config = require('./config/production.js');
const dconfig = require('./config/default.js');

module.exports = {
    dev: Object.assign({}, {
        driver: 'pg',
    }, dconfig.db.client),
    production: Object.assign({}, {
        driver: 'pg',
    }, config.db.client),
};
