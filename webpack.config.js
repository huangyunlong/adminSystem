const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackIncludeAssetsPlugin = require("html-webpack-include-assets-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const mode = process.env.NODE_ENV.trim();

var config = {
  mode: mode,
  entry: {
    app: "./main.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: mode == "production" ? "[name].[hash].js" : "[name].js"
  },
  plugins: [
    // new webpack.ProgressPlugin((percentage, ...args) => {
    //   console.info(parseInt(percentage * 100), '%', ...args);
    // }),
    new CleanWebpackPlugin(["dist"]),
    new CopyWebpackPlugin([{
      from: {
        glob: path.resolve(__dirname, "dll/**/*"),
        dot: true
      },
      to: path.resolve(__dirname, "dist")
    }]),
    new HtmlWebpackPlugin({
      template: "./index.html",
      minify: true
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: [{
        path: "dll",
        glob: "*.js",
        globPath: path.resolve(__dirname, "dll")
      }],
      append: false
    }),
    new webpack.ProvidePlugin({
      _: "lodash" // 全局配置lodash
    })
  ],
  module: {
    rules: [{
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/"
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: false
            }
          },
          "postcss-loader"
        ]
      },
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: [
              "@babel/transform-runtime",
              [
                "@babel/plugin-proposal-decorators",
                {
                  legacy: true
                }
              ],
              [
                "@babel/plugin-proposal-class-properties",
                {
                  loose: true
                }
              ]
            ]
          }
        }
      }
    ]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  performance: {
    hints: false
  }
};

if (mode == "development") {
  config.devtool = "inline-cheap-source-map"; // 只有开发模式需要sourcemap，生产模式不需要
  config.plugins.push(
    // 开发者模式下，因为每次改动代码后需要尽快看到效果，所以这里需要将这些又大又不经常变的包做成静态文件，而上线时，这些过大的包，又不能全部打包进来，所以只能用webpack自己的tree shaing策略来打包已经依赖的模块进来
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./dll/manifest.json")
    })
  );
  config.devServer = {
    contentBase: "./dist",
    inline: true,
    compress: true,
    disableHostCheck: true, // 关闭局域网之间不能访问的限制
    host: "0.0.0.0",
    useLocalIp: true,
    open: false, // 自动打开浏览器页面
    // proxy: {
    //   // 配置代理
    //   // '/api': 'http://localhost:3000'
    // },
    proxy: {
      '/sp': {
        target: 'https://sp.tkfun.site',
        pathRewrite: {
          '^/sp': ''
        },
        changeOrigin: true,
        secure: false, // 接受 运行在 https 上的服务
      },
      '/uploadImgApi': {
        target: 'https://sp.tkfun.site',
        pathRewrite: {
          '^/uploadImgApi': ''
        },
        changeOrigin: true,
        secure: false, // 接受 运行在 https 上的服务
      },
      '/manage': {
        target: 'https://sp.roseski.com/manage',
        pathRewrite: {
          '^/manage': ''
        },
        changeOrigin: true,
        secure: false, // 接受 运行在 https 上的服务
      },
      '/tables': {
        target: 'http://93.179.103.52:5000/table',
        pathRewrite: {
          '^/tables': ''
        },
        changeOrigin: true,
        secure: false, // 接受 运行在 https 上的服务
      }
    },
    port: 8080
    // clientLogLevel: 'info', watchContentBase: true
  };
}
if (mode == "production") {
  config.plugins.unshift(new CleanWebpackPlugin(["dll"]));
}

module.exports = config;