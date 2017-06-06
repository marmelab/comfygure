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

    switch (err.code) {
    case 'ECONNREFUSED':
    case 'ECONNRESET':
    case 'ETIMEDOUT':
    case 'ENETUNREACH':
    case 'ENOTFOUND':
        error(`${dim(err.message)}
${red('Unable to reach the comfy server.')}
Please check your connection and try again.`);
        break;
    case 403:
        error(`${red('You are not allowed to perform this action.')}
Please check your read or write token.`);
        break;
    default:
        error(`${dim(err.message)}
${dim(err.stack)}
${red('Unknown error, command aborted.')}
If the error persists, please report it at ${cyan('https://github.com/marmelab/comfygure/issues')}`);

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
