const minimist = require('minimist');

const help = (ui) => {
    const { bold } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy log - List all configuration versions

${bold('SYNOPSIS')}
        ${bold('comfy')} log <environment> [<options>]

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        -t, --tags      Show only tagged versions
        -h, --help      Show this very help message
`);
};

module.exports = (ui, modules) => function* (rawOptions) {
    const { bold, red, yellow, gray, green } = ui.colors;
    const options = minimist(rawOptions);
    const env = options._[0];
    const onlyTags = options.t || options.tags;

    if (options.help || options.h || options._.includes('help')) {
        help(ui);
        return ui.exit(0);
    }

    if (!env) {
        ui.error(`${red('No environment specified.')}`);
        ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} log <environment> [<options>]

Type ${green('comfy log --help')} for details`);
        return ui.exit(0);
    }

    const project = yield modules.project.retrieveFromConfig();
    const configs = yield modules.config.list(project, env, 'default', !onlyTags);

    const noTag = gray('no tag');

    for (const config of configs) {
        const tags = config.tags.length > 0 ? config.tags.map(tag => yellow(tag)).join(', ') : noTag;
        ui.print(`${env}\t${config.hash}\t(${tags})`);
    }
};
