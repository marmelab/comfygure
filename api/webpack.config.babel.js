const path = require('path');
const ConfigPlugin = require('webpack-config-plugin');

module.exports = {
    target: 'node',
    entry: {
        configurations: './src/handlers/configurations.js',
        environments: './src/handlers/environments.js',
        projects: './src/handlers/projects.js',
    },
    plugins: [
        new ConfigPlugin({ dir: path.resolve(__dirname, 'config') }),
    ],
    output: {
        libraryTarget: 'commonjs',
        path: '.webpack',
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
        noParse: [/pg\/lib\/native/],
    },
    externals: ['aws-sdk'],
};
