/* eslint-disable global-require */
const clientFactory = require('./client');
const projectModuleFactory = require('./domain/project');
const environmentModuleFactory = require('./domain/environment');
const configModuleFactory = require('./domain/config');
const tagModuleFactory = require('./domain/tag');

const main = (ui, evt) => {
    const commands = {
        help: require('./commands/help'),
        init: require('./commands/init'),
        env: require('./commands/env'),
        add: require('./commands/add'),
        get: require('./commands/get'),
        ls: require('./commands/ls'),
        tag: require('./commands/tag'),
        admin: require('./commands/admin'),
    };

    const run = function* () {
        const request = ui.digestEvent(evt);

        let command = commands.help;
        if (request.command) {
            command = commands[request.command];
        }

        if (!command) {
            const { red, green } = ui.colors;

            ui.error(
                `The command ${red(request.command)} doesn't exist.` +
                `\nType ${green('comfy help')} to see the available commands.`
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

    return { run };
};

module.exports = main;
