const deepSet = require('lodash.set');
const yaml = require('js-yaml');
const toFlat = require('./toFlat');

const parseJSON = content => JSON.parse(content);

const toJSON = content => JSON.stringify(content, null, 4);

const parseYAML = content => yaml.safeLoad(content);

const toYAML = content => {
    if (!content || Object.keys(content).length === 0) return '';

    return yaml.safeDump(content);
};

const parseFlat = content => {
    const body = {};
    const keys = Object.keys(content).sort();

    for (const key of keys) {
        deepSet(body, key, content[key]);
    }

    return body;
};

const toEnvVars = flatContent => {
    let source = '';

    for (const key of Object.keys(flatContent).sort()) {
        // Replace each ' by '"'"' in the value
        // @see http://stackoverflow.com/a/1250279/3868326
        const value = flatContent[key].replace("'", "'\"'\"'");

        const envVar = key.replace('.', '_').replace('[', '_').replace(']', '').toUpperCase();

        source += `export ${envVar}='${value}';\n`;
    }

    return source;
};

module.exports = {
    parseJSON,
    toJSON,
    parseYAML,
    toYAML,
    parseFlat,
    toEnvVars,
    toFlat,
};
