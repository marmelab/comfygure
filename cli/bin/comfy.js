#!/usr/bin/env node

const nodeVersion = require('node-version');

if (nodeVersion.major < 6) {
    console.error('Comfygure requires at least version 6 of Node. Please upgrade!');
    process.exit(1);
}

const co = require('co');

const ui = require('../src/ui/console');
const comfy = require('../src')(ui, process.argv);

// Dunno why I need to use co but I have to. I'll see that later
co(comfy).catch(error => console.error(error));
