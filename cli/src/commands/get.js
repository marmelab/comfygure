const minimist = require('minimist');
const { parseFlat, toJSON, toYAML, toEnvVars } = require('../format');

const help = (ui) => {
    const { bold, cyan, dim } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy get - Retrieve the configuration for a given environment

${bold('SYNOPSIS')}
        ${bold('comfy')} get <environment> [<options>]

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        --json          Output the configuration as a JSON file (default)
        --envvars       Output the configuration as a sourceable bash file
        --yml           Output the configuration as a YAML file
        -t, --tag=<tag> Get a tag for this config version (default: stable)
        -h, --help      Show this very help message

${bold('EXAMPLES')}
        ${dim('# Get the development configuration as json')}
        ${cyan('comfy get development')}
        ${dim('# Get the staging configuration for the next tag in yaml')}
        ${cyan('comfy get staging -t next --jml > config/staging.yaml')}
        ${dim('# Get the production configuration and set it as environment variables')}
        ${cyan('comfy get production --envvars | source /dev/stdin')}
`);
};

module.exports = (ui, modules) => function* (rawOptions) {
    const { bold, green, red } = ui.colors;
    const options = minimist(rawOptions);
    const env = options._[0];
    const tag = options.tag || options.t || 'stable';

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    if (!env) {
        ui.error(red('No environment specified.'));
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} get <environment> [<options>]

Type ${green('comfy get --help')} for details`);
        return ui.exit(0);
    }


    const project = yield modules.project.retrieveFromConfig();
    const config = yield modules.config.get(project, env, {
        configName: 'default',
        tag,
    });

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
