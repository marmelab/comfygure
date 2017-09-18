const { name, version } = require('../../package.json');

module.exports = () => {
    console.log(`${name} ${version}`);
};
