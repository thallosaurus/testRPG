const path = require('path');

module.exports = {
    entry: './src/module.ts',
    devtool: 'inline-source-map',
    context: __dirname,
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: "/node_modules/"
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.bundle.js'
    }
}