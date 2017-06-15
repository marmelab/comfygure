const config = require('config');

// dev is the configuration by default, using config to change the conf based on NODE_ENV value
module.exports = {
    dev: Object.assign({}, {
        driver: 'pg',
    }, config.db.client),
};
