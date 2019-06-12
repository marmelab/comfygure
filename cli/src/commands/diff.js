const fs = require('fs');
const minimist = require('minimist');
const { exec } = require('child_process');

const help = ui => {
    const { bold, cyan, dim } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy diff - Show diff of two configurations for a given environment

${bold('SYNOPSIS')}
        ${bold('comfy')} diff <environment> <hash|tag> [<hash|tag>]

${bold('OPTIONS')}
        <environment>   Name of the environment (must already exist in project)
        <hash>          Hash or tag of your configuration to diff it
        --json          Output the configurations as a JSON file
        --envvars       Output the configurations as a sourceable bash file
        --yml           Output the configurations as a YAML file
        --js            Output the configurations as a JavaScript script
        -w              Ignore all whitespaces
        

${bold('EXAMPLES')}
        ${dim('# Diff from the latest version to the `stable` one')}
        ${cyan('comfy diff development stable')}
        ${dim('# Diff from one version to another')}
        ${cyan('comfy diff development ')}
`);
};

module.exports = (ui, modules) =>
    function* diff(rawOptions) {
        const { red, bold, green } = ui.colors;
        const options = minimist(rawOptions);
        const [env, ...hashes] = options._;
        const { w } = options;

        if (options.help || options.h || options._.includes('help')) {
            help(ui);
            return ui.exit(0);
        }

        if (!env || hashes.length === 0 || hashes.length > 2) {
            ui.error(red('Not enough or too much arguments.'));
            ui.print(`${bold('SYNOPSIS')}
        ${bold('comfy')} diff <environment> <hash|tag> [<hash|tag>]

Type ${green('comfy diff --help')} for details`);
            return ui.exit(0);
        }

        const project = yield modules.project.retrieveFromConfig();

        const firstConfigOutput = yield modules.config.getAndFormat(project, env, hashes[0], undefined, options);
        const secondConfigOutput = yield modules.config.getAndFormat(
            project,
            env,
            hashes[1] || 'latest',
            undefined,
            options
        );

        const firstConfigName = `/tmp/comfy-${hashes[0]}`;
        const secondConfigName = `/tmp/comfy-${hashes[1] || 'latest'}`;

        yield cb => fs.writeFile(firstConfigName, firstConfigOutput + '\n', { flag: 'w' }, cb);
        yield cb => fs.writeFile(secondConfigName, secondConfigOutput + '\n', { flag: 'w' }, cb);

        const code = yield cb =>
            exec(`diff ${firstConfigName} ${secondConfigName} -u ${w ? ' -w' : ''}`, (error, stdout, stderr) => {
                if (error && error.code && error.code !== 1) {
                    ui.error(red('Failed to use the `diff` util. Is it installed on your host?'));
                    return cb(null, 1);
                }

                stderr && ui.error(stderr);
                stdout && ui.print(stdout);
                cb(null, 0);
            });

        yield cb => fs.unlink(firstConfigName, cb);
        yield cb => fs.unlink(secondConfigName, cb);

        ui.exit(code);
    };
