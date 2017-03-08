const { toFlat } = require('../format');
const { encrypt, decrypt } = require('../crypto');

module.exports = (client, ui) => {
    const list = function* (project, env, config, all = false) {
        const url = `${project.origin}/projects/${project.id}/environments/${env}/configurations/${config}`;

        try {
            return yield client.get(url);
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const add = function* (project, env, content, { configName, tag }) {
        const body = toFlat(content);

        Object.keys(body).forEach((key) => {
            body[key] = encrypt(body[key].toString(), project.passphrase);
        });

        const url = `${project.origin}/projects/${project.id}/environments/${env}/config/${configName}/${tag}`;

        try {
            yield client.post(url, body);
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const get = function* (project, env, tag, { configName }) {
        const url = `${project.origin}/projects/${project.id}/environments/${env}/config/${configName}/${tag}`;

        let response;
        try {
            response = yield client.get(url);
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }

        const { body } = response;

        Object.keys(body).forEach((key) => {
            body[key] = decrypt(body[key].toString(), project.passphrase);
        });

        return { body };
    };

    const getFromHash = function* (project, env, hash, { configName }) {
        return {
            name: 'api',
            hash: '9cb5a5b31f8f01221ac35433146989d75e23e216',
            previous: null,
            tag: null,
            defaultFormat: 'yml',
            body: {
                'api.url': 'http://perdu.com',
                'list[0].truc': 42,
            },
        };
    };

    return { list, add, get, getFromHash };
};
