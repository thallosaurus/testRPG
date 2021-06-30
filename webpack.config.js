const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HtmlWebpackInjector } = require('inject-body-webpack-plugin');

const serverConfig = {
    target: 'node',
    entry: './src/lib/Server/ServerMain.ts',
    devtool: 'source-map',
    context: __dirname,
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: path.resolve(__dirname, "node_modules/")
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'server.bundle.js'
    }
}

const clientConfig = {
    entry: './src/module.ts',
    devtool: 'source-map',
    context: __dirname,
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: path.resolve(__dirname, "node_modules/")
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'client.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            templateContent: "<html><head></head><body></body></html>"
        })
/*         new InjectBodyPlugin({
            content: "<canvas id='game'></canvas>"
        }) */
    ]
}

module.exports = [serverConfig, clientConfig]; /* {
    entry: {
        client: './src/module.ts',
        server: './src/lib/Server/ServerMain.ts'
    },
    devtool: 'inline-source-map',
    context: __dirname,
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: path.resolve(__dirname, "node_modules/")
        }]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            "http": false,
            "url": false,
            "crypto": false,
            "path": false,
            "stream": false,
            "zlib": false,
            "fs": false,
            "querystring-es3": false,
            "querystring": false
        }
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    }
} */