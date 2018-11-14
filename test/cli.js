const { exec } = require('child_process');

const COMFY_BIN = '../../cli/bin/comfy.js';
const DEFAULT_CWD = './.env/';
const DEFAULT_ORIGIN = 'http://localhost:3000';

const run = command => (callback) => {
    // Replace `comfy` by its binary location
    const commandToExecute = command.startsWith('comfy')
        ? `${COMFY_BIN}${command.substr(5)}`
        : command;

    exec(commandToExecute, { cwd: DEFAULT_CWD }, (error, stdout, stderr) => {
        if (error) {
            callback(error);
            return;
        }

        callback(null, { stdout, stderr });
    });
};

const createProject = function* () {
    yield run(`comfy init --origin '${DEFAULT_ORIGIN}'`);
};

module.exports = { run, createProject };
