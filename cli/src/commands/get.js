const minimist = require('minimist');
const {
    parseFlat,
    toJSON,
    toYAML,
    toEnvVars,
    toJavascript,
} = require('../format');
const { JSON, YAML, JAVASCRIPT } = require('../format/constants');

const help = (ui) => {
    const { bold, cyan, dim } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy get - Retrieve the configuration for a given environment

${bold('SYNOPSIS')}
        ${bold('comfy')} get <environment> [<selector>] [<options>]

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        <selector>      Get only a subset of the config (dot separated)
        --json          Output the configuration as a JSON file (default)
        --envvars       Output the configuration as a sourceable bash file
        --yml           Output the configuration as a YAML file
        --js            Output the configuration as a JavaScript script
        -t, --tag=<tag> Get a tag for this config version (default: stable)
        -h, --help      Show this very help message

${bold('EXAMPLES')}
        ${dim('# Get the development configuration as json')}
        ${cyan('comfy get development')}
        ${dim('# Get the staging configuration for the next tag in yaml')}
        ${cyan('comfy get staging -t next --yml > config/staging.yaml')}
        ${dim('# Get the production configuration and set it as environment variables')}
        ${cyan('comfy get production --envvars | source /dev/stdin')}

        ${dim('# Get only a field of the config')}
        ${dim('config.json: { "admin": { "user": "Admin", "pass": "1234" } }')}
        ${cyan('comfy get production admin.user')} // Admin
`);
};

module.exports = (ui, modules) => function* get(rawOptions) {
    const { bold, green, red } = ui.colors;
    const options = minimist(rawOptions);
    const [env, selector] = options._;
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

    if ([options.json, options.yml, options.js].filter(x => x).length > 1) {
        ui.error(`${red('You need to chose either --json, --yml or --js')}`);
        help(ui, 1);
    }

    let format = config.defaultFormat;
    if (options.json) format = JSON;
    if (options.yml) format = YAML;
    if (options.js) format = JAVASCRIPT;

    let entries = config.body;
    if (selector) {
        const sanitizedSelector = selector.toLowerCase();

        if (entries[sanitizedSelector]) {
            ui.print(entries[sanitizedSelector]);
            return ui.exit();
        }

        entries = Object
            .entries(entries)
            .map(([key, value]) => [key.toLowerCase(), value])
            .filter(([key]) => key.startsWith(sanitizedSelector))
            .reduce((newEntries, [key, value]) => ({
                ...newEntries,
                [options.envvars || format === 'envvars' ? key : key.replace(`${sanitizedSelector}.`, '')]: value,
            }), {});
    }

    if (options.envvars) {
        ui.print(toEnvVars(entries));
        ui.exit();
    }

    const body = parseFlat(entries);

    switch (format) {
    case YAML:
        ui.print(toYAML(body));
        break;
    case JAVASCRIPT:
        ui.print(toJavascript(body));
        break;
    default:
        ui.print(toJSON(body));
    }

    return ui.exit();
};
