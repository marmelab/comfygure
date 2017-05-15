#!/usr/bin/env node

const HttpServer = require('http-server');
const path = require('path');
const minimist = require('minimist');

const server = HttpServer.createServer({ root: path.resolve(__dirname, '../build') });

const options = minimist(process.argv.slice(2));
const port = options.p || 3000;

server.listen(port, (error) => {
    if (error) {
        console.error(error.message);
        process.exit(1);
    }
    console.log(`
    launching admin on http://localhost:${port}
    press Ctrl+C to end`
    );
});
