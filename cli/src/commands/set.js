const minimist = require('minimist');
const set = require('lodash.set');

const { parseFlat } = require('../format');

const help = ui => {
    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy set - Replace an entry of an existing configuration

${bold('SYNOPSIS')}
        ${bold('comfy')} set <environment> <selector> <value> [<options>]

${bold('OPTIONS')}
        <environment>     Name of the environment (must already exist in project)
        <selector>        Select the entry of the config (dot separated)
        <value>           The replacement value
        -t, --tag=<tag>   Set a tag for this config version (default: stable)
        -h, --help        Show this very help message

${bold('EXAMPLES')}
        ${cyan('comfy set development admin.user "SuperUser"')}
        ${cyan('comfy set development admin.pass "S3cret" -t next')}
`);
};

module.exports = (ui, modules) =>
    function* setCommand(rawOptions) {
        const { red, green, bold, dim } = ui.colors;
        const options = minimist(rawOptions);
        const env = options._[0];
        const selector = options._[1];
        const value = options._[2];
        const tag = options.tag || options.t || 'latest';

        if (options.help || options.h || options._.includes('help')) {
            help(ui);
            return ui.exit(0);
        }

        if (!env) {
            ui.error(red('No environment specified.'));
        }

        if (!selector) {
            ui.error(red('No selector specified.'));
        }

        if (!value) {
            ui.error(red('No value specified.'));
        }

        if (!env || !selector || !value) {
            ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} set <environment> <selector> <value> [<options>]

Type ${dim('comfy set --help')} for details`);
            return ui.exit(0);
        }

        const project = yield modules.project.retrieveFromConfig();
        const config = yield modules.config.get(project, env, {
            configName: 'default',
            tag,
        });

        const sanitizedSelector = selector.toLowerCase();
        const updatedConfig = set(parseFlat(config.body), sanitizedSelector, value);

        yield modules.config.add(project, env, updatedConfig, {
            tag,
            configName: 'default',
            format: config.defaultFormat,
        });

        ui.print(`${bold(green('comfy configuration successfully saved'))}`);
        return ui.exit();
    };
