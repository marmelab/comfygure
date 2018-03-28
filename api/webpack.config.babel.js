const path = require('path');
const ConfigPlugin = require('webpack-config-plugin');
const slsw = require('serverless-webpack');

module.exports = {
    target: 'node',
    entry: slsw.lib.entries,
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
