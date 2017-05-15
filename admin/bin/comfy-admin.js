#!/usr/bin/env node

const HttpServer = require('http-server');
const path = require('path');

const server = HttpServer.createServer({ root: path.resolve(__dirname, '../build') });
server.listen(3000, (error) => {
    if (error) {
        console.error(error.message);
        process.exit(1);
    }
    console.log(`
    launching admin on http://localhost:3000
    press Ctrl+C to end`
    );
});
