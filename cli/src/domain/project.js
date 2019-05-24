const fs = require('fs');
const ini = require('ini');
const path = require('path');
const { CONFIG_FOLDER, CONFIG_PATH, DEFAULT_ORIGIN, CREDENTIALS_VARIABLE } = require('./constants');
const { generateNewPrivateKey, generateNewHmacKey } = require('../crypto');

const getConfigFolder = () => `${process.cwd()}${path.sep}${CONFIG_FOLDER}`;
const getConfigPath = () => `${process.cwd()}${path.sep}${CONFIG_PATH}`;

// The function `fs.mkdir(folder, { recursive: true })` doesn't exist in Node <10
const mkdirRecursive = function*(folder) {
    try {
        yield cb => fs.mkdir(folder, cb);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            throw error;
        }
    }
};

module.exports = (client, ui) => {
    const create = function*(name, environment, origin = DEFAULT_ORIGIN) {
        const url = `${origin}/projects`;

        try {
            return yield client.post(url, { name, environment });
        } catch (error) {
            ui.printRequestError(error);
            return ui.exit(1);
        }
    };

    const saveToConfig = function*(project, privateKey, hmacKey, origin = DEFAULT_ORIGIN) {
        const config = ini.stringify(
            {
                projectId: project.id,
                accessKey: project.accessKey,
                secretToken: project.writeToken,
                origin,
                privateKey,
                hmacKey,
            },
            { section: 'project' }
        );

        const filename = getConfigPath();
        yield mkdirRecursive(getConfigFolder());
        yield cb => fs.writeFile(filename, config, { flag: 'w' }, cb);
    };

    const checkProjectInfos = ({ id, accessKey, secretToken, privateKey, hmacKey, origin }) => {
        const errors = [];
        const { red, bold } = ui.colors;

        if (!id) {
            errors.push(`Unable to locate the ${red('project identifier')}.`);
        }

        if (!accessKey) {
            errors.push(`Unable to locate the ${red('access key')}.`);
        }

        if (!secretToken) {
            errors.push(`Unable to locate the ${red('secret token')}.`);
        }

        if (!privateKey) {
            errors.push(`Unable to locate the ${red('private key')} to decrypt your configs.`);
        }

        if (!hmacKey) {
            errors.push(`Unable to locate the ${red('hmac key')} to sign and verify your configs.`);
        }

        if (!origin) {
            errors.push(`Unable to locate the ${red('server origin')} to decrypt your configs.`);
        }

        if (errors.length > 0) {
            ui.error(`${errors.join('\n')}

Have you exported the ${bold(CREDENTIALS_VARIABLE)} environment variable?

Have you tried to initialize comfy in this folder?
Type ${bold('comfy init')} to do so.`);
            ui.exit(1);
        }
    };

    const retrieveFromConfig = () => {
        if (process.env[CREDENTIALS_VARIABLE]) {
            try {
                const buffer = Buffer.from(process.env[CREDENTIALS_VARIABLE], 'base64');
                const credentials = JSON.parse(buffer.toString('utf8'));
                checkProjectInfos(credentials);
                return credentials;
            } catch (error) {
                ui.error(`The credentials encoded in ${CREDENTIALS_VARIABLE} are invalid`);
                ui.exit(1);
            }
        }

        const envs = {
            id: process.env.COMFY_PROJECT_ID,
            accessKey: process.env.COMFY_ACCESS_KEY,
            secretToken: process.env.COMFY_SECRET_TOKEN,
            privateKey: process.env.COMFY_PRIVATE_KEY,
            hmacKey: process.env.COMFY_HMAC_KEY,
            origin: process.env.COMFY_ORIGIN,
        };

        const filename = getConfigPath();

        if (!fs.existsSync(filename)) {
            checkProjectInfos(envs);
            return envs;
        }

        const file = fs.readFileSync(filename, 'utf8');
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

    const toEncodedCredentials = () => {
        const project = retrieveFromConfig();
        const buffer = Buffer.from(JSON.stringify(project), 'utf8');
        return buffer.toString('base64');
    };

    const permanentlyDelete = function*() {
        const project = retrieveFromConfig();
        const url = `${project.origin}/projects/${project.id}`;

        try {
            yield client.delete(url, client.buildAuthorization(project));
        } catch (error) {
            ui.printRequestError(error);
            ui.exit(1);
        }

        yield cb => fs.unlink(getConfigPath(), cb);
        yield cb => fs.rmdir(getConfigFolder(), cb);
    };

    return {
        create,
        retrieveFromConfig,
        saveToConfig,
        CONFIG_FOLDER,
        CONFIG_PATH,
        CREDENTIALS_VARIABLE,
        generateNewPrivateKey,
        generateNewHmacKey,
        getConfigFolder,
        getConfigPath,
        permanentlyDelete,
        toEncodedCredentials,
    };
};
