const chalk = require('chalk');
const readline = require('readline');

const print = console.log; // eslint-disable-line no-console
const error = console.error;  // eslint-disable-line no-console

const digestEvent = ([bin, file, command, ...args]) => {
    // bin & file are: node comfy.js, we don't use these infos

    return {
        command,
        arguments: args,
    };
};

const exit = (code = 0) => {
    process.exit(code);
};

const colors = chalk;

const input = {
    text: question => (callback) => {
        const reader = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        reader.question(`${question} `, (answer) => {
            reader.close();
            callback(null, answer);
        });
    },
};

const printRequestError = (err) => {
    const { red, cyan, gray, bold, dim } = colors;

    const contactUs = `If the error persist, please contact us:
${gray('-')} Email: ${cyan('info@marmelab.com')}
${gray('-')} Issue: ${cyan('https://github.com/marmelab/comfygure/issues')}`;

    switch (err.code) {
    case 'ECONNREFUSED':
    case 'ECONNRESET':
    case 'ETIMEDOUT':
    case 'ENETUNREACH':
        error(`${red('Unable to reach the server.')} Please check your connection and try again.\n\n${contactUs}`);
        break;
    case 403:
        error(`${red('You are not allowed to perform this action.')} Please check your read or write token.`);
        break;
    default:
        error(`${red('An error occured.')} We are sorry. ${contactUs}

${bold(err.message)}
${dim(err.stack)}`);
    }
};

module.exports = {
    colors,
    print,
    error,
    exit,
    input,
    digestEvent,
    printRequestError,
};
