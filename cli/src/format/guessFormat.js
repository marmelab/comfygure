const { JSON, YAML, ENVVARS } = require('./constants');

module.exports = (ext) => {
    switch ((ext || '').toLowerCase()) {
    case '.json':
        return JSON;
    case '.yml':
    case '.yaml':
        return YAML;
    default:
        return ENVVARS;
    }
};
