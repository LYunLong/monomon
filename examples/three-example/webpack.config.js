

const path = require('path');
const webpack = require('webpack');

const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const InlineChunkHtmlPlugin = require('inline-chunk-html-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: "development",
    optimization: {
        moduleIds: 'natural',
      },
    entry: {
        scene_1: (process.env.NODE_ENV == "test" ? ["./views/scene_1/index.js", "./common/console.js"]: ["./views/scene_1/index.js"] ),
        scene_2: (process.env.NODE_ENV == "test" ? ["./views/scene_2/index.js", "./common/console.js"]: ["./views/scene_2/index.js"] ),
        glsl_test: (process.env.NODE_ENV == "test" ? ["./views/glsl_test/index.js", "./common/console.js"]: ["./views/glsl_test/index.js"] ),
        // model: process.env.NODE_ENV == "dev"? 
        //     [ "./app/model/main.js", './app/model/dev.js' ]:
        //     [ "./app/model/main.js"],
        // break:  "./app/break/main.js"
    },

    // 使用 glob 等工具使用若干通配符，运行时获得 entry 的条目
    // module.exports = {
    //     entry: glob.sync('./project/**/index.js').reduce((acc, path) => {
    //         const entry = path.replace('/index.js', '')
    //         acc[entry] = path
    //         return acc
    //     }, {
    //     }),
    // }


    output: {
        path: __dirname + `/publish`,
        filename: "[name]_bundle.js",
        // publicPath: '../'  //分文件夹问题解决
    },
    resolve: {
        alias: {
            '@common': path.resolve(__dirname, './common'),
            '@': path.resolve(__dirname, './node_modules'),
            '@three': '@/three',
            '@tjsm': '@three/examples/jsm',

        },
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/, use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.less$/, use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"},
                    {loader: "less-loader"}
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env'],
                        "plugins": [
                            "@babel/plugin-transform-runtime",
                            "@babel/plugin-transform-regenerator"
                        ]
                    }
                }
            }
        ]
    },
    devServer: {
        port: 9006,
        host: '0.0.0.0',
        // host: '172.20.10.6',
        // host: '192.168.5.106',
        // server: 'https',
        allowedHosts: 'all',
        hot: true,
        // static: '../',
        // open: ['/scene_1.html']
    },
    plugins: [

        // new BundleAnalyzerPlugin(),

        new HtmlWebpackPlugin({
            filename: 'scene_1.html', // 配置输出文件名和路径
            template: __dirname+ '/views/scene_1/index.html',    // 配置html文件模板，将js和这个关联起来
            minify: { // 压缩 HTML 的配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                removeComments: true,   // 移除注释
                collapseWhitespace: true,   // 缩去空格
                removeAttributeQuotes: true, // 移除属性引号
            },
            inject: 'body',
            chunks: ["scene_1"]
        }),
        // new InlineChunkHtmlPlugin(HtmlWebpackPlugin, ['model']),
        new HtmlWebpackPlugin({
            filename: 'scene_2.html', // 配置输出文件名和路径
            template: __dirname+ '/views/scene_2/index.html',    // 配置html文件模板，将js和这个关联起来
            minify: { // 压缩 HTML 的配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                removeComments: true,   // 移除注释
                collapseWhitespace: true,   // 缩去空格
                removeAttributeQuotes: true, // 移除属性引号
            },
            inject: 'body',
            chunks: ["scene_2"]
        }),

        new HtmlWebpackPlugin({
            filename: 'glsl_test.html', // 配置输出文件名和路径
            template: __dirname+ '/views/glsl_test/index.html',    // 配置html文件模板，将js和这个关联起来
            minify: { // 压缩 HTML 的配置
                minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
                minifyJS: true, // 压缩 HTML 中出现的 JS 代码
                removeComments: true,   // 移除注释
                collapseWhitespace: true,   // 缩去空格
                removeAttributeQuotes: true, // 移除属性引号
            },
            inject: 'body',
            chunks: ["glsl_test"]
        }),

        

        new CleanWebpackPlugin({}),

        new CopyPlugin({
            patterns: [{
                from: "./static",
                to: "static"
            }]
        }),

        new webpack.DefinePlugin({
            "process.env": {
                ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ]
}
