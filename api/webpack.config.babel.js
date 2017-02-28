const path = require('path');
const ConfigPlugin = require('webpack-config-plugin');

module.exports = {
    target: 'node',
    entry: './src/handler.js',
    plugins: [
        new ConfigPlugin({ dir: path.resolve(__dirname, 'config') }),
        // new webpack.DefinePlugin({
        //     CONFIG: JSON.stringify(config),
        // }),
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, 'node_modules'),
            },
            { test: /\.json$/, loader: 'json-loader' },
        ],
    },
};
