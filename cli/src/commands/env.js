const help = (ui, code = 0) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} env <options>

    ${dim('Options')}
        help                Show this very help message
        ls                  List all environments
        add <environment>   Create the environment <environment>
`);
    ui.exit(code);
};

const ls = (ui, modules) => function* () {
    const project = yield modules.project.retrieveFromConfig();
    const environments = yield modules.environment.list(project);

    for (const environment of environments) {
        ui.print(environment.name);
    }

    ui.exit();
};

const add = (ui, modules, options) => function* () {
    const { red } = ui.colors;

    if (!options.length) {
        ui.error(`${red('No environment specified.')}`);
        help(ui, 1);
    }

    if (options.length > 1) {
        ui.error(`${red('Invalid environment format. The environment name should be one word.')}`);
        help(ui, 1);
    }

    const project = yield modules.project.retrieveFromConfig();
    const environment = yield modules.environment.add(project, options[0]);

    ui.print(environment);
    ui.exit();
};

module.exports = (ui, modules) => function* ([command, ...options]) {
    switch (command) {
    case 'ls':
        yield ls(ui, modules);
        break;
    case 'add':
        yield add(ui, modules, options);
        break;
    default:
        help(ui);
    }
};
