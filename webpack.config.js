
const cacheLoader = require('./index.js')
cacheLoader()

module.exports = {
    mode: 'development',
    entry: {
        index: './test/index.ts'
    },
    output: {
        path: __dirname + '/test',
        filename: 'output.js'
    },
    resolve: {
        extensions: ['.js', '.ts', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    },
                ],
                exclude: /node_modules/
            },
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'},
                    {loader: 'postcss-loader'},
                    {loader: 'less-loader'}
                ]
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader'
                }]
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: 'assets/[hash].[ext]',
                        limit: 10000
                    }
                }]
            }
        ]
    }
}