
const cacheLoader = require('./index.js')
cacheLoader()

module.exports = {
    mode: 'development',
    entry: {
        index: './test/index.js'
    },
    output: {
        path: __dirname + '/test',
        filename: 'output.js'
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
                test: /\.less$/,
                use: [
                    {loader: 'css-loader', options: {sourceMap: true}},
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'less-loader'}
                ]
            }
        ]
    }
}