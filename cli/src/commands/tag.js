const minimist = require('minimist');

const help = (ui, code = 0) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} tag <action> <options>

    ${dim('Actions')}
        help                                                                Show this very help message
        add -e <environment> -c <configuration> -t <tag>                    Add a new tag
        delete -e <environment> -c <configuration> -t <tag>                 Delete a tag
        move -e <environment> -c <configuration> -t <tag> --hash <hash>     Move a tag to a new version

    ${dim('Hint')}
        To list tags, you can type ${bold('comfy ls <environment>')}
`);
    ui.exit(code);
};

const add = function* (ui, modules, options) {
    const { red, bold } = ui.colors;

    const getOption = (option, name) => {
        if (!options[option]) {
            ui.error(`${red(`No ${name} specified.`)}`);
            help(ui, 1);
        }

        return options[option];
    };

    const environment = getOption('e', 'environment');
    const configuration = getOption('c', 'configuration');
    const tag = getOption('t', 'tag');
    const hash = getOption('hash', 'hash');

    const project = yield modules.project.retrieveFromConfig();
    const newTag = yield modules.tag.add(project, environment, configuration, tag, hash);

    console.warn(newTag);
    ui.print(`${bold('Cool!')} Your new tag "${bold(newTag.name)}" was successfuly created.`);
    ui.exit();
};

module.exports = (ui, modules) => function* ([command, ...rawOptions]) {
    const options = minimist(rawOptions);

    if (options._.includes('help')) {
        help(ui);
    }

    switch (command) {
    case 'add':
        yield add(ui, modules, options);
        break;
    default:
        help();
    }
};
