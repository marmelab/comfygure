/* eslint-disable global-require */
const clientFactory = require('./client');
const projectModuleFactory = require('./domain/project');
const environmentModuleFactory = require('./domain/environment');
const configModuleFactory = require('./domain/config');
const tagModuleFactory = require('./domain/tag');

const printVersion = require('./domain/printVersion');

const main = (ui, evt) => {
    const commands = {
        help: require('./commands/help'),
        init: require('./commands/init'),
        env: require('./commands/env'),
        setall: require('./commands/setall'),
        set: require('./commands/set'),
        get: require('./commands/get'),
        log: require('./commands/log'),
        tag: require('./commands/tag'),
        version: require('./commands/version'),
        project: require('./commands/project'),
    };

    return function* mainCommand() {
        const request = ui.digestEvent(evt);

        if (request.command === '-V' || request.arguments.includes('-V')) {
            printVersion();
            ui.exit();
        }

        let command = commands.help;
        if (request.command) {
            command = commands[request.command];
        }

        if (!command) {
            const { red, green } = ui.colors;

            ui.error(
                `The command ${red(request.command)} doesn't exist.`
                + `\nType ${green('comfy help')} to see the available commands.`
            );
            ui.exit(1);
        }

        const client = clientFactory(require('request'));

        const modules = {
            project: projectModuleFactory(client, ui),
            environment: environmentModuleFactory(client, ui),
            config: configModuleFactory(client, ui),
            tag: tagModuleFactory(client, ui),
        };

        yield command(ui, modules)(request.arguments);
    };
};

module.exports = main;
