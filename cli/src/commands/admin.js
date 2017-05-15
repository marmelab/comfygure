const exec = require('child_process').exec;

function moduleAvailable(name) {
    try {
        require.resolve(name);
        return true;
    } catch (e) {} // eslint-disable-line no-empty
    return false;
}

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

module.exports = ui => function* () {
    if (moduleAvailable('comfy-admin')) {
        yield runCommand('comfy-admin');
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
    Either run the command with sudo and trust us or look on internet to see how to configure your
    environment so that sudo is no longer required to install global packages (which is a lot better)
            `);
            return;
        }
        throw error;
    }
    yield runCommand('comfy-admin');
};
