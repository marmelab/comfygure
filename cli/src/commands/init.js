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
        const projectName = yield ask(`- What is your project name? [${defaultProjectName}]`);

        const defaultEnvironment = process.env.NODE_ENV || 'development';
        const environment = yield ask(`- What is your first environment? [${defaultEnvironment}]`);

        const defaultPassphrase = crypto.randomBytes(256).toString('hex');
        const passphrase = yield ask('- What is your encryption passphrase? [generated]');

        return {
            projectName: projectName || defaultProjectName,
            environment: environment || defaultEnvironment,
            passphrase: passphrase || defaultPassphrase,
        };
    };

    const addConfigToGitignore = function* () {
        const gitIgnoreConfig = yield ask(
            `${bold('You are in a git directory.')} ` +
            `Would you add ${dim(CONFIG_PATH)} to the ${dim('.gitignore')}? [yes]`
        );

        if (!['n', 'no', 'No', 'NO'].includes(gitIgnoreConfig)) {
            const gitignore = `${process.cwd()}${path.sep}.gitignore`;
            const alreadyExist = fs.existsSync(gitignore);

            yield cb => fs.writeFile(gitignore, `${CONFIG_PATH}\n`, { flag: alreadyExist ? 'a' : 'w' }, cb);
        }
    };

    // Starting
    checkAlreadyInitialized();

    ui.print('We just need a few informations about your project:');
    const { projectName, environment, passphrase } = yield askProjectInfos();

    ui.print('\nCreating your new project ...');
    const project = yield modules.project.create(projectName, environment);

    ui.print(`\n${bold('Nice.')} We will save your credentials under ${dim(CONFIG_PATH)}.`);
    const isGitDirectory = fs.existsSync(`${process.cwd()}${path.sep}.git`);

    if (isGitDirectory) {
        yield addConfigToGitignore();
    }

    yield modules.project.saveToConfig(project, passphrase);

    ui.print(`
${bold(green('comfy is now configured!'))} Here are what you need to know about your project:

Project name: ${cyan(project.name)}
Environments: ${cyan(project.environments.join(', '))}

Access Token: ${project.access_key}
Secret Read Token: ${project.read_token}
Secret Write Token: ${project.write_token}

Passphrase to decrypt your configs:
${passphrase}

Keep these informations safe & secret!
`);

    ui.exit();
};
