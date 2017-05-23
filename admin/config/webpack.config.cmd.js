'use strict';
const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        require.resolve('react-dev-utils/webpackHotDevClient'),
        require.resolve('./polyfills'),
        path.resolve(__dirname, '../src/index.js'),
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

    module: {
        // First, run the linter.
        // It's important to do this before Babel processes the JS.
        loaders: [
            // ** ADDING/UPDATING LOADERS **
            // The "url" loader handles all assets unless explicitly excluded.
            // The `exclude` list *must* be updated with every change to loader extensions.
            // When adding a new loader, you must add its `test`
            // as a new entry in the `exclude` list in the "url" loader.

            // "url" loader embeds assets smaller than specified size as data URLs to avoid requests.
            // Otherwise, it acts like the "file" loader.
            {
                exclude: [/\.html$/, /\.(js|jsx)$/, /\.css$/, /\.json$/, /\.svg$/],
                loader: 'url',
                query: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            // Process JS with Babel.
            {
                test: /\.(js|jsx)$/,
                include: [path.resolve(__dirname, '../src')],
                loader: 'babel',
            },
            // The notation here is somewhat confusing.
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader normally turns CSS into JS modules injecting <style>,
            // but unlike in development configuration, we do something different.
            // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
            // (second argument), then grabs the result CSS and puts it into a
            // separate file in our build process. This way we actually ship
            // a single CSS file in production instead of JS code injecting <style>
            // tags. If you use code splitting, however, any async bundles will still
            // use the "style" loader inside the async code so CSS from them won't be
            // in the main CSS file.
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css?importLoaders=1!postcss', false),
                // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
            },
            // JSON is not enabled by default in Webpack but both Node and Browserify
            // allow it implicitly so we also enable it.
            {
                test: /\.json$/,
                loader: 'json',
            },
            // "file" loader for svg
            {
                test: /\.svg$/,
                loader: 'file',
                query: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            // ** STOP ** Are you adding a new loader?
            // Remember to add the new extension(s) to the "url" loader exclusion list.
        ],
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
            config: {
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
