#!/usr/bin/env node

const minimist = require('minimist');
const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const exec = require('child_process').exec;

const runCommand = cmd =>
    new Promise((resolve, reject) => {
        exec(cmd, error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });

const webpackConfig = require('../config/webpack.config.cmd');

const options = minimist(process.argv.slice(2));
const port = options.p || 3000;

let compiler = webpack(webpackConfig);
let webpackServer = new webpackDevServer(compiler, {
    clientLogLevel: 'error',
    quiet: true,
});

webpackServer.listen(port, error => {
    if (error) {
        console.error(error.message);
        process.exit(1);
    }
    global.console.log(`
    launching admin on http://localhost:${port}
    press Ctrl+C to end`);

    runCommand(`python -m webbrowser http://localhost:${port}`).catch(() => {
        // python -m webbrowser is not supported (rare), the user will just need to open the browser by hand
    });
});
