const exec = require('child_process').exec;
const minimist = require('minimist');

const moduleAvailable = (name) => {
    try {
        require.resolve(name);
        return true;
    } catch (e) {} // eslint-disable-line no-empty
    return false;
};

const runCommand = cmd =>
    new Promise((resolve, reject) => {
        exec(cmd, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

const help = (ui) => {

    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy admin - Run the comfy admin web application

${bold('SYNOPSIS')}
        ${bold('comfy')} admin [<options>]

${bold('OPTIONS')}
        -p, --port      The port used to serve the admin (defaults to 3000)
        -h, --help      Show this very help message

${bold('EXAMPLE')}
        ${cyan('comfy admin -p 8080')}
`);
};

module.exports = ui => function* admin(rawOptions) {
    const options = minimist(rawOptions);
    const port = options.p || options.port || 3000;

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    if (moduleAvailable('comfy-admin')) {
        yield runCommand(`comfy-admin -p ${port}`);
        return;
    }
    ui.print('You need to install comfy-admin: npm install -g comfy-admin');
    const response = yield ui.input.text('Do you want us to install it for you ? y/n');

    if (response.toLowerCase() !== 'y') {
        return;
    }

    try {
        yield runCommand('npm install -g comfy');
    } catch (error) {
        if (error.message.match('Please try running this command again as root/Administrator.')) {
            ui.print(`
    Uh oh, it looks like npm need administrator rights to install package globally on your machine.
    Either run the command with sudo and trust us, or look on internet to see how to configure your
    environment so that sudo is no longer required to install global packages (which is a lot better).
            `);
            return;
        }
        throw error;
    }
    yield runCommand(`comfy-admin -p ${port}`);
};
