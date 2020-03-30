const { resolve } = require('path');

module.exports = {
    entry: {
        'app': [
            'es6-promise/auto',
            'react-hot-loader/patch',
            './src/index',
            './style/main.scss'
        ]
    },
    output: {
        path: resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js'
    },
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
    },
    devServer: {
        // host: '0.0.0.0',
        historyApiFallback: true,
        contentBase: './'
    }
};