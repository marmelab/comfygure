const minimist = require('minimist');

const help = (ui, code = 0) => {
    const { bold, dim } = ui.colors;

    ui.print(`
    ${bold('comfy')} ls <environment> <options>

    ${dim('Options')}
        help        Show this very help message
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
    const configs = yield modules.config.list(project, env, !!options.a);

    for (const config of configs) {
        const tag = config.tag ? `${yellow(config.tag)}` : `${gray('no-tag')}`;
        ui.print(`${env}/${bold(config.name)}\t${config.hash}\t(${tag})`);
    }
};
