const {
    optimize,
    DefinePlugin,
    LoaderOptionsPlugin,
    SourceMapDevToolPlugin,
    HotModuleReplacementPlugin,
    NamedModulesPlugin,
} = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { resolve } = require('path');

const { UglifyJsPlugin } = optimize;

module.exports = {
    entry: {
        index: []
            .concat(
                process.env.NODE_ENV === 'development'
                    ? ['react-hot-loader/patch', 'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true']
                    : [],
            )
            .concat([resolve(__dirname, './src/index.js')]),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [resolve(__dirname, './src')],
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    forceEnv: 'browser',
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
            {
                test: /\.jpe?g$|\.gif$|\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: '[hash].[ext]',
                },
            },
            {
                test: /\.(otf|svg)(\?.+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
            {
                test: /\.eot(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/vnd.ms-fontobject',
                },
            },
            {
                test: /\.woff2(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff2',
                },
            },
            {
                test: /\.woff(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                },
            },
            {
                test: /\.ttf(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-ttf',
                },
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../build'),
        publicPath: '/',
    },
    plugins: [
        // prints more readable module names in the browser console on HMR updates
        new NamedModulesPlugin(),

        new DefinePlugin(
            {
                // @TODO: add config from ./comfy/config here
            },
        ),
        new LoaderOptionsPlugin({
            options: {
                debug: process.env.NODE_ENV === 'development',
                context: __dirname,
                minimize: process.env.NODE_ENV !== 'development',
            },
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, './public/index.html'),
            chunks: ['index'],
            inject: 'body',
        }),
    ].concat(
        process.env.NODE_ENV === 'development'
            ? [new HotModuleReplacementPlugin(), new SourceMapDevToolPlugin({ filename: '[file].map' })]
            : [
                  new UglifyJsPlugin({
                      beautify: false,
                      mangle: {
                          screw_ie8: true,
                      },
                      compress: {
                          screw_ie8: true,
                      },
                      comments: false,
                      sourceMap: false,
                  }),
                  new CompressionPlugin(),
              ],
    ),
    resolve: {
        modules: [resolve(__dirname, './'), resolve(__dirname, './node_modules')],
    },
    resolveLoader: {
        modules: [resolve(__dirname, './node_modules')],
    },
};
