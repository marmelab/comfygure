const { parseFlat, toJSON, toYAML, toEnvVars, toJavascript, toFlat } = require('../format');
const { JSON, YAML, JAVASCRIPT } = require('../format/constants');

const { encrypt, decrypt } = require('../crypto');

module.exports = (client, ui) => {
    const list = function*(project, env, config, all = false) {
        let url = config
            ? `${project.origin}/projects/${project.id}/environments/${env}/configurations/${config}/history`
            : `${project.origin}/projects/${project.id}/environments/${env}/configurations/history`;

        if (all) {
            url += '?all';
        }

        try {
            return yield client.get(url, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            return ui.exit(1);
        }
    };

    const add = function*(project, env, content, { configName, tag, format }) {
        const entries = toFlat(content);

        Object.keys(entries).forEach(key => {
            entries[key] = encrypt(entries[key], project.privateKey, project.hmacKey);
        });

        const url = `${project.origin}/projects/${project.id}/environments/${env}/configurations/${configName}/${tag}`;

        const body = {
            entries,
            format,
        };

        try {
            yield client.post(url, body, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const get = function*(project, env, { tag, hash }) {
        let url = `${project.origin}/projects/${project.id}/environments/${env}/configurations/default`;
        const hashOrTag = hash || tag;

        if (hashOrTag) {
            url += `/${hashOrTag}`;
        }

        let response;
        try {
            response = yield client.get(url, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }

        const { body, defaultFormat } = response;

        Object.keys(body).forEach(key => {
            body[key] = decrypt(body[key], project.privateKey, project.hmacKey);
        });

        return { body, defaultFormat };
    };

    const getAndFormat = function*(project, env, hash, selector, options = {}) {
        const config = yield get(project, env, { hash });

        let format = config.defaultFormat;
        if (options.json) format = JSON;
        if (options.yml) format = YAML;
        if (options.js) format = JAVASCRIPT;

        let entries = config.body;
        if (selector) {
            const sanitizedSelector = selector.toLowerCase();
            const entry = entries[sanitizedSelector] || entries[selector];

            if (entry) {
                // @TODO Support subset getter for nested entries
                return entry;
            }

            entries = Object.entries(entries)
                .map(([key, value]) => [key.toLowerCase(), value])
                .filter(([key]) => key.startsWith(sanitizedSelector))
                .reduce(
                    (newEntries, [key, value]) =>
                        Object.assign({}, newEntries, {
                            [options.envvars || format === 'envvars'
                                ? key
                                : key.replace(`${sanitizedSelector}.`, '')]: value,
                        }),
                    {}
                );
        }

        if (options.envvars) {
            return toEnvVars(entries);
        }

        const body = parseFlat(entries);

        switch (format) {
            case YAML:
                return toYAML(body);
            case JAVASCRIPT:
                return toJavascript(body);
            default:
                return toJSON(body);
        }
    };

    return { list, add, get, getAndFormat };
};
