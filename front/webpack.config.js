const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BrowserSyncWebpackPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: ['babel-polyfill', './src/index.jsx'],
    output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'bundle.js',
    },
    module: {
       rules: [
           // для стилей в теге style
           // {
           //     test: /\.css$/,
           //     use: [
           //         {
           //             loader: 'style-loader'
           //         },
           //         {
           //             loader: 'css-loader'
           //         }
           //     ]
           // }
           {
               test: /\.css$/,
               use: [
                   {
                       loader: MiniCssExtractPlugin.loader,
                       options: {
                           // you can specify a publicPath here
                           // by default it uses publicPath in webpackOptions.output
                           publicPath: '../',
                           hmr: process.env.NODE_ENV === 'development',
                       },
                   },
                   'css-loader',
               ],
           },
           {
               test: /\.(png|jpe?g|gif)$/,
               use: [
                   {
                       loader: 'file-loader',
                       options: {
                           outputPath: 'images',
                           name: '[name].[ext]'
                       }
                   }
               ]
           },
           {
               test: /\.jsx?$/,
               exclude: /node_modules/,
               loader: 'babel-loader',
               query: {
                   presets: [
                       '@babel/preset-env',
                       '@babel/preset-react'
                   ]
               }
           }
       ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: [
                path.resolve(__dirname, 'dist')
            ]
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css'
        }),
        new BrowserSyncWebpackPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['./dist']},
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.css']
    }
};
