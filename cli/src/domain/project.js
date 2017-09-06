const fs = require('fs');
const ini = require('ini');
const path = require('path');
const { CONFIG_FOLDER, CONFIG_PATH, DEFAULT_ORIGIN } = require('./constants');
const { generateNewPrivateKey, generateNewHmacKey } = require('../crypto');

module.exports = (client, ui) => {
    const create = function* (name, environment, origin = DEFAULT_ORIGIN) {
        const url = `${origin}/projects`;

        try {
            return yield client.post(url, { name, environment });
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }
    };

    const saveToConfig = function* (project, privateKey, hmacKey, origin = DEFAULT_ORIGIN) {
        const config = ini.stringify({
            projectId: project.id,
            accessKey: project.accessKey,
            secretToken: project.writeToken,
            origin,
            privateKey,
            hmacKey,
        }, { section: 'project' });

        const filename = `${process.cwd()}${path.sep}${CONFIG_PATH}`;
        yield cb => fs.mkdir(`${process.cwd()}${path.sep}${CONFIG_FOLDER}`, cb);
        yield cb => fs.writeFile(filename, config, { flag: 'w' }, cb);
    };

    const checkProjectInfos = ({ id, accessKey, secretToken, privateKey, hmacKey, origin }) => {
        const errors = [];
        const { red, dim, bold } = ui.colors;

        const set = v => `Please set ${dim(v)} or edit your ${dim(CONFIG_PATH)} file.`;

        if (!id) {
            errors.push(`Unable to locate the ${red('project identifier')}.
${set('COMFY_PROJECT_ID')}`);
        }

        if (!accessKey) {
            errors.push(`Unable to locate the ${red('access key')}.
${set('COMFY_ACCESS_KEY')}`);
        }

        if (!secretToken) {
            errors.push(`Unable to locate the ${red('secret token')}.
${set('COMFY_SECRET_TOKEN')}`);
        }

        if (!privateKey) {
            errors.push(`Unable to locate the ${red('private key')} to decrypt your configs.
${set('COMFY_PRIVATE_KEY')}`);
        }

        if (!hmacKey) {
            errors.push(`Unable to locate the ${red('hmac key')} to sign and verify your configs.
${set('COMFY_HMAC_KEY')}`);
        }

        if (!origin) {
            errors.push(`Unable to locate the ${red('server origin')} to decrypt your configs.
${set('COMFY_ORIGIN')}`);
        }

        if (errors.length > 0) {
            ui.error(`${errors.join('\n')}

Have you tried to initialize comfy on this folder?
Type ${bold('comfy init')} to do so.`);
            ui.exit(1);
        }
    };

    const retrieveFromConfig = function* () {
        const envs = {
            id: process.env.COMFY_PROJECT_ID,
            accessKey: process.env.COMFY_ACCESS_KEY,
            secretToken: process.env.COMFY_SECRET_TOKEN,
            privateKey: process.env.COMFY_PRIVATE_KEY,
            hmacKey: process.env.COMFY_HMAC_KEY,
            origin: process.env.COMFY_ORIGIN,
        };

        const filename = `${process.cwd()}${path.sep}${CONFIG_PATH}`;

        if (!fs.existsSync(filename)) {
            checkProjectInfos(envs);
            return envs;
        }
        const file = fs.readFileSync(filename, 'utf-8');
        const config = ini.parse(file);

        const projectInfos = Object.assign({}, envs, {
            id: config.project.projectId,
            accessKey: config.project.accessKey,
            secretToken: config.project.secretToken,
            privateKey: config.project.privateKey,
            hmacKey: config.project.hmacKey,
            origin: config.project.origin,
        });

        checkProjectInfos(projectInfos);
        return projectInfos;
    };

    return {
        create,
        retrieveFromConfig,
        saveToConfig,
        CONFIG_FOLDER,
        CONFIG_PATH,
        generateNewPrivateKey,
        generateNewHmacKey,
    };
};
