const deepSet = require('lodash.set');
const yaml = require('js-yaml');
const toFlat = require('./toFlat');
const guessFormat = require('./guessFormat');

const parseJSON = content => JSON.parse(content);

const toJSON = content => JSON.stringify(content, null, 4);

const parseYAML = content => yaml.safeLoad(content);

const toYAML = (content) => {
    if (!content || Object.keys(content).length === 0) return '';

    return yaml.safeDump(content);
};

const parseFlat = (content) => {
    const body = {};
    const keys = Object.keys(content).sort();

    for (const key of keys) {
        deepSet(body, key, content[key]);
    }

    return body;
};

const toEnvVars = (flatContent) => {
    let source = '';

    for (const key of Object.keys(flatContent).sort()) {
        const value = flatContent[key] ? flatContent[key].toString() : '';

        // Replace each ' by '"'"' in the value
        // @see http://stackoverflow.com/a/1250279/3868326
        const escapedValue = value.replace("'", "'\"'\"'");

        const envVar = key
            .replace(/\./g, '_')
            .replace(/\[/g, '_')
            .replace(/\]/g, '')
            .toUpperCase();

        source += `export ${envVar}='${escapedValue}';\n`;
    }

    return source;
};

const toJavascript = content => `window.COMFY = ${JSON.stringify(content)};`;

module.exports = {
    toJavascript,
    parseJSON,
    toJSON,
    parseYAML,
    toYAML,
    parseFlat,
    toEnvVars,
    toFlat,
    guessFormat,
};
