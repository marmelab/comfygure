const minimist = require('minimist');

const help = (ui, code = 0) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} ls <environment> <options>

    ${dim('Options')}
        help        Show this very help message
        -c          The configuration name (optional if you have only one config)
        -a          Show all configuration versions (even non-tagged ones)
`);
    ui.exit(code);
};

module.exports = (ui, modules) => function* ([env, ...rawOptions]) {
    const { bold, red, yellow, gray } = ui.colors;

    if (!env) {
        ui.error(`${red('No environment specified.')}`);
        help(ui, 1);
    }

    const options = minimist(rawOptions);

    if (env === 'help' || options._.includes('help')) {
        help(ui);
    }

    const project = yield modules.project.retrieveFromConfig();
    const configs = yield modules.config.list(project, env, options.c, !!options.a);

    const noTag = gray('no-tag');

    for (const config of configs) {
        const tags = config.tags.length > 0 ? config.tags.map(tag => yellow(tag)).join(', ') : noTag;
        ui.print(`${env}/${bold(config.name)}\t${config.hash}\t(${tags})`);
    }
};
