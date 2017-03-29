const minimist = require('minimist');
const { parseFlat, toJSON, toYAML, toEnvVars } = require('../format');

const help = (ui) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} get <environment> <options>

    ${dim('Options')}
        help        Show this very help message
        -c          The configuration name (optional if you have only one config)
        -t          Get a tagged version for this configuration (default: stable)
        --hash      Get a specific configuration version (if the hash is specified, the tag is ignored)
        --json      Display the configuration as a JSON file
        --yml       Display the configuration as a YAML file
        --envvars   Display the configuration as a sourceable bash file
`);
    ui.exit(0);
};

module.exports = (ui, modules) => function* ([env, ...rawOptions]) {
    const { red } = ui.colors;

    if (!env) {
        ui.error(`${red('No environment specified.')}`);
        help(ui, 1);
    }

    const options = minimist(rawOptions);

    if (env === 'help' || options._.includes('help')) {
        help(ui);
    }

    const tag = options.t || 'stable';
    const hash = options.hash;
    const configName = options.c || 'default';

    const project = yield modules.project.retrieveFromConfig();
    let config;
    if (hash) {
        const error = new Error('Retrieve configuration by hash is not available for now.');
        ui.printRequestError(error);
        process.exit(1);
    } else {
        config = yield modules.config.get(project, env, tag, { configName });
    }

    if (options.json && options.yml) {
        ui.error(`${red('You need to chose either --json or --yml')}`);
        help(ui, 1);
    }

    let format = config.defaultFormat;
    if (options.json) format = 'json';
    if (options.yml) format = 'yml';

    if (options.envvars) {
        ui.print(toEnvVars(config.body));
        ui.exit();
    }

    const body = parseFlat(config.body);

    if (format === 'yml') {
        ui.print(toYAML(body));
    } else {
        ui.print(toJSON(body));
    }

    ui.exit();
};
