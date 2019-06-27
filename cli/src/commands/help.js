module.exports = ui => () => {
    const { bold, dim, gray, cyan } = ui.colors;

    ui.print(`
${bold('NAME')}
        comfy - Store and deploy settings across development, test, and production environments, using an encrypted key-value store.

${bold('SYNOPSIS')}
        ${bold('comfy')} <command> [<options>]

${bold('COMMANDS')}
        help        Show this very help message
        init        Initialize comfy for a directory
        setall      Add a new configuration version
        set         Replace a single entry in an existing configuration
        get         Retrieve a configuration
        diff        Diff two configuration versions
        env         Manage configuration environments
        tag         Manage configuration tags
        log         List all configuration versions
        project     Manage or deploy the current project
        version     Output CLI version information and exit

${bold('EXAMPLES')}
        ${dim('# Display the help')}
        ${cyan('comfy help')}
        ${dim('# Initialize comfy in the current directory')}
        ${cyan("comfy init --origin 'http://mycomfy.mydomain.com'")}
        ${dim('# Set a new configuration version')}
        ${cyan('comfy setall development config/api.json')}
        ${dim('# Add production environment')}
        ${cyan('comfy env add production')}
        ${dim('# Set a new configuration version for the next tag')}
        ${cyan('comfy setall production -t next config/api_prod.json')}
        ${dim('# List all configuration versions in production')}
        ${cyan('comfy log production')}
        ${dim('# Retrieve the latest development configuration and use it to set env vars')}
        ${cyan('comfy get development --envvars | source /dev/stdin')}
        ${dim('# Diff from your latest version to the stable one')}
        ${cyan('comfy diff development stable')}

${bold('ABOUT')}
        ${bold('comfy')} is licensed under the MIT Licence, sponsored and supported by marmelab.
        ${gray('-')} ${cyan('https://marmelab.com')}
`);
    ui.exit(0);
};
