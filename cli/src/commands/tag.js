const minimist = require('minimist');

const help = (ui) => {
    const { bold, dim, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy tag - Manage configuration tags

${bold('SYNOPSIS')}
        ${bold('comfy')} tag <command> [<options>]

${bold('COMMANDS')}
        add <environment> <tag> <hash>      Add a new tag
        list <environment>                  List tags
        move <environment> <tag> <hash>     Move a tag to a new version
        delete <environment> <tag>          Delete a tag

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        <tag>           Name of the tag (e.g. "stable")
        <hash>          Name of the hash (e.g. "0b49fc8766d432fdd7422d948836d32f9632d72a")
        -h, --help      Show this very help message

${bold('EXAMPLES')}
        ${dim('# Add a new "experimental" tag for development configuration')}
        ${cyan('comfy tag add development experimental 517ac071cec80340c8fc08cdb7eeefefbaf1dbba')}
        ${dim('# List tags for development configuration')}
        ${cyan('comfy tag list development')}
        ${dim('# Move the "stable" tag to another hash')}
        ${cyan('comfy tag move development stable 964e51df37c0fe2a518998fb6457b461c4013d28')}
        ${dim('# Delete the "experimental" tag in production')}
        ${cyan('comfy tag delete production experimental')}

${bold('HINT')}
        To list tags, you can type ${bold('comfy log <environment>')}
`);
};

const add = function* (ui, modules, options) {
    const { green, red, bold } = ui.colors;
    if (options._.length < 3) {
        ui.error(red('Missing environment, tag, or hash'));
    }

    if (options._.length > 3) {
        ui.error(red('Too many arguments'));
    }

    if (options._.length !== 3) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} tag add <environment> <tag> <hash>

Type ${green('comfy tag --help')} for details`);
        return ui.exit(0);
    }

    const environment = options._[0];
    const tag = options._[1];
    const hash = options._[2];

    const project = yield modules.project.retrieveFromConfig();
    yield modules.tag.add(project, environment, 'default', tag, hash);

    ui.print(`${bold(green('Tag successfully created'))}`);
    ui.exit();
};

const list = function* (ui, modules, options) {
    const { green, red, bold, yellow } = ui.colors;
    if (options._.length == 0) {
        ui.error(red('Missing environment'));
    }

    if (options._.length > 1) {
        ui.error(red('Too many arguments'));
    }

    if (options._.length !== 1) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} tag ls <environment>

Type ${green('comfy tag --help')} for details`);
        return ui.exit(0);
    }

    const env = options._[0];

    const project = yield modules.project.retrieveFromConfig();
    const configs = yield modules.config.list(project, env, 'default', false);

    for (const config of configs) {
        const tags = config.tags.length > 0 ? config.tags.map(tag => yellow(tag)).join(', ') : '';
        ui.print(`${env}\t${config.hash}\t(${tags})`);
    }

    ui.exit();
};

const move = function* (ui, modules, options) {
    const { green, red, bold } = ui.colors;
    if (options._.length < 3) {
        ui.error(red('Missing environment, tag, or hash'));
    }

    if (options._.length > 3) {
        ui.error(red('Too many arguments'));
    }

    if (options._.length !== 3) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} tag move <environment> <tag> <hash>

Type ${green('comfy tag --help')} for details`);
        return ui.exit(0);
    }

    const environment = options._[0];
    const tag = options._[1];
    const hash = options._[2];

    const project = yield modules.project.retrieveFromConfig();
    yield modules.tag.move(project, environment, 'default', tag, hash);

    ui.print(`${bold(green('Tag successfully moved'))}`);
    ui.exit();
};

const remove = function* (ui, modules, options) {
    const { green, red, bold } = ui.colors;
    if (options._.length < 2) {
        ui.error(red('Missing environment, or tag'));
    }

    if (options._.length > 2) {
        ui.error(red('Too many arguments'));
    }

    if (options._.length !== 2) {
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} tag delete <environment> <tag>

Type ${green('comfy tag --help')} for details`);
        return ui.exit(0);
    }

    const environment = options._[0];
    const tag = options._[1];

    const project = yield modules.project.retrieveFromConfig();
    const removedTag = yield modules.tag.remove(project, environment, 'default', tag);

    ui.print(`${bold(green('Tag successfully deleted'))}`);
    ui.exit();
};

module.exports = (ui, modules) => function* ([command, ...rawOptions]) {
    const options = minimist(rawOptions);

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    switch (command) {
    case 'add':
        yield add(ui, modules, options);
        break;
    case 'list':
    case 'ls':
        yield list(ui, modules, options);
        break;
    case 'move':
    case 'mv':
        yield move(ui, modules, options);
        break;
    case 'delete':
    case 'remove':
    case 'rm':
        yield remove(ui, modules, options);
        break;
    default:
        help(ui);
    }
};
