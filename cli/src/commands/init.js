const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

module.exports = (ui, modules) => function* () {
    const ask = ui.input.text;
    const { bold, dim, yellow, green, cyan } = ui.colors;

    const CONFIG_PATH = modules.project.CONFIG_PATH;

    const checkAlreadyInitialized = () => {
        if (fs.existsSync(`${process.cwd()}${path.sep}${CONFIG_PATH}`)) {
            ui.error(
                `${yellow('comfy is already initialized!')}` +
                `\nYou can update your configuration by editing ${dim(CONFIG_PATH)}.`
            );
            ui.exit(1);
        }
    };

    const askProjectInfos = function* () {
        const folders = process.cwd().split(path.sep);
        const defaultProjectName = folders[folders.length - 1];
        const projectName = yield ask(`- What is the project name? [${defaultProjectName}]`);

        const defaultEnvironment = process.env.NODE_ENV || 'development';
        const environment = yield ask(`- What is the first environment? [${defaultEnvironment}]`);

        const defaultPassphrase = crypto.randomBytes(256).toString('hex');
        const passphrase = yield ask('- What is the encryption passphrase? [generated]');

        return {
            projectName: projectName || defaultProjectName,
            environment: environment || defaultEnvironment,
            passphrase: passphrase || defaultPassphrase,
        };
    };

    const addConfigToGitignore = function* () {
        const gitIgnoreConfig = yield ask(
            `- Add the comfy config file to ${dim('.gitignore')}? [yes]`
        );

        if (!['n', 'no', 'No', 'NO'].includes(gitIgnoreConfig)) {
            const gitignore = `${process.cwd()}${path.sep}.gitignore`;
            const alreadyExist = fs.existsSync(gitignore);

            yield cb => fs.writeFile(gitignore, `${CONFIG_PATH}\n`, { flag: alreadyExist ? 'a' : 'w' }, cb);
        }
    };

    // Starting
    checkAlreadyInitialized();

    ui.print('To create a comfy project for this directory, please answer the following questions:');
    const { projectName, environment, passphrase } = yield askProjectInfos();
    const isGitDirectory = fs.existsSync(`${process.cwd()}${path.sep}.git`);
    if (isGitDirectory) {
        yield addConfigToGitignore();
    }

    ui.print('\nInitializing project configuration...');
    const project = yield modules.project.create(projectName, environment);

    ui.print(`Configuration saved in ${dim(CONFIG_PATH)}`);

    yield modules.project.saveToConfig(project, passphrase);

    ui.print(`${bold(green('comfy project successfully created'))}`);

    ui.exit();
};
