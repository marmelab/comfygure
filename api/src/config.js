if (!!process.env.SERVERLESS) {
    module.exports = CONFIG;
} else {
    module.exports = require('config');
}
