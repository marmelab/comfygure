'use strict';
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const fs = require('fs');
const ini = require('ini');

function getConfig() {
    try {
        require.resolve(path.resolve(process.cwd(), './.comfy/config'));
    } catch (e) {
        return { project: {} };
    }
    return ini.parse(fs.readFileSync(path.resolve(process.cwd(), './.comfy/config'), 'utf-8'));
}

const config = getConfig();

module.exports = {
    context: path.resolve(__dirname, '..'),
    // Don't attempt to continue if there are any errors.
    bail: true,
    // In production, we only want to load the polyfills and the app code.
    entry: [
        require.resolve('./polyfills'),
        path.resolve(__dirname, '../src/cmdConfig.js'),
        path.resolve(__dirname, '../build/static/js/main.js'),
    ],
    output: {
        // Next line is not used in dev but WebpackDevServer crashes without it:
        path: path.resolve(__dirname, '../src/build'),
        // This does not produce a real file. It's just the virtual path that is
        // served by WebpackDevServer in development. This is the JS bundle
        // containing code from all our entry points, and the Webpack runtime.
        filename: 'static/js/bundle.js',
        publicPath: `http://localhost:${3006}/`,
    },

    // We use PostCSS for autoprefixing only.
    postcss: function() {
        return [
            autoprefixer({
                browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                ],
            }),
        ];
    },
    plugins: [
        // Generates an `index.html` file with the <script> injected.
        new InterpolateHtmlPlugin({
            PUBLIC_URL: '',
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new webpack.DefinePlugin({
            CONFIG: {
                projectId: JSON.stringify(config.project.projectId),
                token: JSON.stringify(config.project.secretToken),
                origin: JSON.stringify(config.project.origin),
                passphrase: JSON.stringify(config.project.passphrase),
            },
        }),
    ],
    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
