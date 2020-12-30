const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./src/index.html",
  filename: "index.html",
  inject: "body",
});
const autoprefixer = require("autoprefixer");

module.exports = (env) => {
  const mode = env.NODE_ENV;
  return {
    mode: mode,
    entry: {
      app: ["./src/js/app.js", "./src/scss/index.scss"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "./assets/js/[name].[hash].js",
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            mode === "production"
              ? MiniCssExtractPlugin.loader
              : "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
                sassOptions: {
                  // https://github.com/sass/node-sass#outputstyle
                  outputStyle: "expanded",
                },
              },
            },
          ],
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(eot|woff|woff2|[ot]tf)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/fonts/",
              publicPath: "/assets/fonts/",
            },
          },
        },
        {
          test: /.*font.*\.svg$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/fonts/",
              publicPath: "/assets/fonts/",
            },
          },
        },
        {
          test: /^(?!.*font).*\.svg$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/images/",
              publicPath: "/assets/images/",
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|webp)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/images/",
              publicPath: "/assets/images/",
            },
          },
        },
      ],
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "./assets/css/[name].[hash].css",
        chunkFilename: "./assets/css/[name].[chunkhash].[hash].css",
      }),
      HtmlWebpackPluginConfig,
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          common: {
            chunks: "initial",
            name: "common",
            minChunks: 3,
            priority: -20,
          },
          // chunk vendor
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
            priority: -10,
          },
          // Merge all the CSS into one file
          styles: {
            name: "app",
            test: /\.s?css$/,
            chunks: "all",
            enforce: true,
          },
        },
      },
    },
    devServer: {
      host: "0.0.0.0",
      compress: false,
      port: 9000,
      noInfo: false,
      hot: true,
      hotOnly: true,
      inline: true,
      open: true,
      overlay: {
        warnings: true,
        errors: true,
      },
      progress: true,
      useLocalIp: true,
      stats: "minimal",
    },
  };
};
