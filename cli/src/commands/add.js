const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const { parseJSON, parseYAML } = require('../format');

const help = (ui, code = 0) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} add <environment> <options>

    ${dim('Options')}
        help        Show this very help message
        -c          The configuration name (optional if you have only one config)
        -f          Specify the file you want to upload
        -t          Set a tag for this config version (default: next)
        --json      Read the configuration file as a JSON file
        --yml       Read the configuration file as a YAML file

    ${dim('Examples')}
        comfy add development -f /config/comfy.json
        comfy add production -c api -t stable -f /config/api.json
`);
    ui.exit(code);
};


module.exports = (ui, modules) => function* ([env, ...rawOptions]) {
    const { red, dim, bold } = ui.colors;

    if (!env) {
        ui.error(`${red('No environment specified.')}`);
        help(ui, 1);
    }

    const options = minimist(rawOptions);

    if (env === 'help' || options._.includes('help')) {
        help(ui);
    }

    if (!options.f) {
        ui.error(`${red('No config file is specified.')} You can specify it with the ${dim('-f')} option.`);
        help(ui, 1);
    }

    const filename = path.normalize(`${process.cwd()}${path.sep}${options.f}`);

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
    let defaultFormat;
    const isYAML = ['.yml', '.yaml'].includes(path.extname(filename));

    try {
        if (options.json) {
            parsedContent = parseJSON(file);
            defaultFormat = 'json';
        } else if (options.yml) {
            parsedContent = parseYAML(file);
            defaultFormat = 'yml';
        } else {
            parsedContent = isYAML ? parseYAML(file) : parseJSON(file);
            defaultFormat = isYAML ? 'yml' : 'json';
        }
    } catch (err) {
        ui.error(`Failed to parse ${red(options.f)}.`);
        ui.exit(1);
    }

    const project = yield modules.project.retrieveFromConfig();
    yield modules.config.add(project, env, parsedContent, {
        tag: options.t || 'next',
        configName: options.c || 'default',
        defaultFormat,
    });

    ui.print(`${bold('Great!')} Your configuration was successfully saved.`);
    ui.exit();
};
