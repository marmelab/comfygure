const minimist = require('minimist');

const help = (ui) => {
    const { bold, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy project - Manage your comfy project

${bold('SYNOPSIS')}
        ${bold('comfy')} project <command>

${bold('COMMANDS')}
        info            Display available infos of the current project
        delete          Permanently delete the current project from the store

${bold('EXAMPLES')}
        ${cyan('comfy project info')}
        ${cyan('comfy project delete')}
`);
};

const info = function* (ui, modules) {
    const project = yield modules.project.retrieveFromConfig();
    const folder = modules.project.getConfigFolder();
    const path = modules.project.getConfigPath();

    ui.table([
        ['Project ID', project.id],
        ['Origin', project.origin],
        ['Config. Folder', folder],
        ['Config. File', path],
        ['API Access Key', project.accessKey],
    ]);
};

const del = function* (ui, modules, rawOptions) {
    const project = yield modules.project.retrieveFromConfig();
    const options = minimist(rawOptions);
    const {
        black,
        bgRedBright,
        cyan,
        bold,
        green,
    } = ui.colors;

    if (options.permanently === true && options.id === project.id) {
        yield modules.project.permanentlyDelete();
        ui.print(`${bold(green('comfy project successfully deleted'))}`);
        ui.exit();
        return;
    }

    const environments = yield modules.environment.list(project);

    ui.print(`
${bgRedBright(black('DANGER ZONE: This action is irreversible!'))}

You are about to delete your comfy project.

This process will delete the following informations from the origin (${project.origin}):
    All configurations and their precedent versions
    All environments (${environments.map(env => env.name).join(', ')})
    All access keys and access logs
    All available informations about the project "${project.id}"

If you are sure, please type the following command:
${cyan('comfy project delete --permanently --id=<project-id>')}
`);
    ui.exit();
};

module.exports = (ui, modules) => function* ([command, ...options]) {
    switch (command) {
    case 'i':
    case 'info':
        yield info(ui, modules);
        break;
    case 'delete':
        yield del(ui, modules, options);
        break;
    default:
        help(ui);
    }
};
