const help = (ui) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} env <options>

    ${dim('Options')}
        help        Show this very help message
        ls          List all environments
`);
    ui.exit(0);
};

const ls = (ui, modules) => function* () {
    const project = yield modules.project.retrieveFromConfig();
    const environments = yield modules.environment.list(project);

    for (const environment of environments) {
        ui.print(environment.name);
    }

    ui.exit();
};

module.exports = (ui, modules) => function* ([command]) {
    switch (command) {
    case 'ls':
        yield ls(ui, modules);
        break;
    default:
        help(ui);
    }
};
