const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { HtmlWebpackInjector } = require('inject-body-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

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
    name: "server",
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
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: path.resolve(__dirname, "node_modules/")
            }
        ]
    },
    name: "client",
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'client.bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Schrottimon",
            template: './src/index.html',
            filename: 'index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: "assets" }
            ]
        })
    ]
}

module.exports = [serverConfig, clientConfig];