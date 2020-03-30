const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'app': [
            'es6-promise/auto',
            './src/index',
            './style/main.scss'
        ]
    },
    output: {
		path: resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: true,
            },
            compress: {
                screw_ie8: true,
            },
            comments: false,
        }),
        new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: {
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'env', "stage-0"]
                }
            }
        },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [{
                    loader: "style-loader", // creates style nodes from JS strings
                    options: {
                        hmr: false
                    }
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "sass-loader" // compiles Sass to CSS
                }]
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'url-loader',
                options: {
                  limit: 25000,
                },
              }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};