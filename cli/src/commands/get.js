const minimist = require('minimist');

const help = ui => {
    const { bold, cyan, dim } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy get - Retrieve the configuration for a given environment

${bold('SYNOPSIS')}
        ${bold('comfy')} get <environment> [<selector>] [<options>]

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        <selector>      Get only a subset of the config (dot separated)
        --json          Output the configuration as a JSON file
        --envvars       Output the configuration as a sourceable bash file
        --yml           Output the configuration as a YAML file
        --js            Output the configuration as a JavaScript script
        -t, --tag=<tag> Get a tag for this config version (default: stable)
        --hash=<hash>   Get a specific hash for this config version (ignore tag then)
        -h, --help      Show this very help message

${bold('EXAMPLES')}
        ${dim('# Get the development configuration as json')}
        ${cyan('comfy get development')}
        ${dim('# Get the staging configuration for the next tag in yaml')}
        ${cyan('comfy get staging -t next --yml > config/staging.yaml')}
        ${dim('# Get the staging configuration for a specific hash in yaml')}
        ${cyan('comfy get staging --hash=5eb9f3ea5cf01384333115007cf7606f --yml > config/staging.yaml')}
        ${dim('# Get the production configuration and set it as environment variables')}
        ${cyan('comfy get production --envvars | source /dev/stdin')}

        ${dim('# Get only a field of the config')}
        ${dim('config.json: { "admin": { "user": "Admin", "pass": "1234" } }')}
        ${cyan('comfy get production admin.user')} // Admin
`);
};

module.exports = (ui, modules) =>
    function* get(rawOptions) {
        const { bold, green, red } = ui.colors;
        const options = minimist(rawOptions);
        const [env, selector] = options._;
        const tag = options.tag || options.t || 'latest';
        const hash = options.hash;

        if (options.help || options.h || options._.includes('help')) {
            help(ui);
            return ui.exit(0);
        }

        if (!env) {
            ui.error(red('No environment specified.'));
            ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} get <environment> [<selector>] [<options>]

Type ${green('comfy get --help')} for details`);
            return ui.exit(0);
        }

        if ([options.json, options.yml, options.js].filter(x => x).length > 1) {
            ui.error(`${red('You need to chose either --json, --yml or --js')}`);
            help(ui);
            return ui.exit(1);
        }

        const project = yield modules.project.retrieveFromConfig();

        const output = yield modules.config.getAndFormat(project, env, hash || tag, selector, options);

        ui.print(output);
        ui.exit();
    };
