const help = (ui) => {
    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy env - Manage configuration environments

${bold('SYNOPSIS')}
        ${bold('comfy')} env <command> [<options>]

${bold('COMMANDS')}
        list                List all environments
        add <environment>   Create the environment <environment>

${bold('OPTIONS')}
        <environment>   Name of the environment
        -h, --help      Show this very help message

${bold('EXAMPLES')}
        ${cyan('comfy env ls')}
        ${cyan('comfy env add production')}
`);
};

const list = (ui, modules) => function* () {
    const project = yield modules.project.retrieveFromConfig();
    const environments = yield modules.environment.list(project);

    for (const environment of environments) {
        ui.print(environment.name);
    }

    ui.exit();
};

const add = (ui, modules, options) => function* () {
    const { red, bold, green } = ui.colors;

    if (!options.length) {
        ui.error(`${red('No environment specified.')}`);
    }

    if (options.length > 1) {
        ui.error(`${red('Invalid environment format. The environment name should be one word.')}`);
    }

    if (options.length !== 1) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} env add <environment>

Type ${green('comfy env --help')} for details`);

        return ui.exit(0);
    }

    const project = yield modules.project.retrieveFromConfig();
    const environment = yield modules.environment.add(project, options[0]);
    const addCommand = `comfy setall ${environment.name}`;

    ui.print(`${bold(green('Environment successfully created'))}`);
    ui.print(`You can now set a configuration fot this environment using ${bold(addCommand)}`);
    ui.exit();
};

module.exports = (ui, modules) => function* ([command, ...options]) {
    switch (command) {
    case 'list':
    case 'ls':
        yield list(ui, modules);
        break;
    case 'add':
        yield add(ui, modules, options);
        break;
    default:
        help(ui);
    }
};
