const path = require('path');
const ConfigPlugin = require('webpack-config-plugin');

module.exports = {
    target: 'node',
    entry: {
        configurations: './src/handlers/configurations.js',
        environments: './src/handlers/environments.js',
        projects: './src/handlers/projects.js',
        tags: './src/handlers/tags.js',
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
        rules: [
            {
                test: /\.js$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {
                                modules: false,
                                loose: true
                            }],
                        ],
                        plugins: [
                            'transform-object-rest-spread'
                        ],
                        cacheDirectory: true
                    }
                }]
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
        noParse: [/pg\/lib\/native/],
    },
    externals: ['aws-sdk'],
};
