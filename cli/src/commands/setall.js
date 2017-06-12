const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { parseYAML } = require('../format');

const help = (ui) => {
    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy setall - Replace the configuration for a given environment

${bold('SYNOPSIS')}
        ${bold('comfy')} setall <environment> <path> [<options>]

${bold('OPTIONS')}
        <environment>     Name of the environment (must already exist in project)
        <path>            Path to a configuration file (accepts json and yml formats)
        -t, --tag=<tag>   Set a tag for this config version (default: stable)
        -h, --help        Show this very help message

${bold('EXAMPLES')}
        ${cyan('comfy setall development config/comfy.json')}
        ${cyan('comfy setall production config/api.yml -t next')}
`);
};


module.exports = (ui, modules) => function* (rawOptions) {
    const { red, green, bold } = ui.colors;
    const options = minimist(rawOptions);
    const env = options._[0];
    const configPath = options._[1];
    const tag = options.tag || options.t || 'stable';

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    if (!env) {
        ui.error(red('No environment specified.'));
    }

    if (!configPath) {
        ui.error(red('No config file specified.'));
    }

    if (!env || !configPath) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} setall <environment> <path> [<options>]

Type ${green('comfy setall --help')} for details`);
        return ui.exit(0);
    }

    const filename = path.normalize(`${process.cwd()}${path.sep}${configPath}`);

    if (!fs.existsSync(filename)) {
        ui.error(`The file ${red(options.f)} doesn't exist.`);
        ui.exit(1);
    }

    const stats = fs.statSync(filename);
    if (!stats.isFile()) {
        ui.error(`The object located at ${red(options.f)} is not a file.`);
        ui.exit(1);
    }

    const file = fs.readFileSync(filename, 'utf-8');

    let parsedContent;

    try {
        parsedContent = parseYAML(file);
    } catch (err) {
        ui.error(red(`Failed to parse ${options.f}`));
    }

    const project = yield modules.project.retrieveFromConfig();
    yield modules.config.add(project, env, parsedContent, {
        tag,
        configName: 'default',
    });

    ui.print(`${bold(green('comfy configuration successfully saved'))}`);
    ui.exit();
};
