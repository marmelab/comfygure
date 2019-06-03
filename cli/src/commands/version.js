const printVersion = require('../domain/printVersion');

module.exports = ui => {
    printVersion();
    ui.exit();
};
