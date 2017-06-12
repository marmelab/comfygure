const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const minimist = require('minimist');

const help = (ui) => {
    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy init - Initialize a comfy configuration for the current directory

${bold('SYNOPSIS')}
        ${bold('comfy')} init [<options>]

${bold('OPTIONS')}
        --name=<name>      The configuration name (defaults to the current directory name)
        --env=<env>        The first environment to create (defaults to 'development')
        --origin=<origin>  URL of the comfy server (defaults to https://comfy.marmelab.com)
        -p, --passphrase   Do not generate passphrase, ask for custom passphrase instead (defaults to false)
        -g, --nogitignore  Do not add .comfy directory to .gitignore
        -h, --help         Show this very help message

${bold('EXAMPLES')}
        ${cyan('comfy init')}
        ${cyan(`comfy init --name foo --env 'development' --origin 'http://mycomfy.mydomain.com'`)}
`);
};

module.exports = (ui, modules) => function* (rawOptions) {
    const ask = ui.input.text;
    const { bold, dim, yellow, green } = ui.colors;
    const options = minimist(rawOptions);

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    const CONFIG_PATH = modules.project.CONFIG_PATH;
    const checkAlreadyInitialized = fs.existsSync(`${process.cwd()}${path.sep}${CONFIG_PATH}`);
    const isGitDirectory = fs.existsSync(`${process.cwd()}${path.sep}.git`);
    const gitignore = `${process.cwd()}${path.sep}.gitignore`;

    if (checkAlreadyInitialized) {
        ui.error(
            `${yellow('comfy is already initialized!')}` +
            `\nYou can update your configuration by editing ${dim(CONFIG_PATH)}.`
        );
        return ui.exit(1);
    }

    const folders = process.cwd().split(path.sep);
    const defaultProjectName = folders[folders.length - 1];
    const projectName = options.name || defaultProjectName;
    const environment = options.env || process.env.NODE_ENV || 'development';
    const passphrase = (options.passphrase || options.p)
        ? yield ask('- What is the encryption passphrase?')
        : crypto.randomBytes(256).toString('hex');

    ui.print('\nInitializing project configuration...');

    const project = yield modules.project.create(projectName, environment, options.origin);
    yield modules.project.saveToConfig(project, passphrase, options.origin);
    const { origin } = yield modules.project.retrieveFromConfig();
    if (isGitDirectory && !options.g) {
        fs.appendFileSync(gitignore, `${CONFIG_PATH}\n`);
    }

    ui.print(`Project created on comfy server ${dim(origin)}`);
    ui.print(`Configuration saved locally in ${dim(CONFIG_PATH)}`);
    ui.print(`${bold(green('comfy project successfully created'))}`);

    ui.exit();
};
