const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
// 已经被5。x 废弃
// const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ModuleConcatenationPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin')
const webpack = require("webpack");

export default function () {
    //清除上次打包内容
    const commonList = [new CleanWebpackPlugin()]
    var returnList = []
    const productionList = [
        //生成入口Html
        new htmlWebpackPlugin({
            title: "打包工具",
            template: './src/index.html',
            minify: {
                // 压缩HTML⽂件
                removeComments: true, // 移除HTML中的注释
                collapseWhitespace: true, // 删除空⽩符与换⾏符
                minifyCSS: true // 压缩内联css
            }
        }),


        new MiniCssExtractPlugin({
            filename: "css/[name]-[contenthash:8].css",
        }),
        new CssMinimizerPlugin({
            minimizerOptions: {
                preset: [
                    'default',
                    {
                        discardComments: {removeAll: true},
                    },
                ],
            },
        }),

        // 开启 scope Hoisting
        new ModuleConcatenationPlugin(),
        // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数
            // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
    ]
    const devList = [
        new htmlWebpackPlugin({
            //选择html模板
            title: "打包工具",
            template: "./src/index.html",
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name]-[contenthash:8].css",
        }),

        new webpack.HotModuleReplacementPlugin(),
    ]

    if (process.env.NODE_ENV === 'dev') returnList = commonList.concat(devList)
    if (process.env.NODE_ENV === 'production') returnList = commonList.concat(productionList)
    return returnList

}
