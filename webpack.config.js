const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const glob = require("glob");

const CopyWebpackPlugin = require("copy-webpack-plugin");

var webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const HtmlWebpackPluginConfigs = glob
  .sync("./src/views/*.html")
  .map((template) => {
    let filename = template.split("/").reverse()[0];
    let files = filename.split(".");
    let config = {
      template,
      filename: files[0] + ".html",
      inject: true,
      title: files[0],
      minify: false,
    };

    return new HtmlWebpackPlugin(config);
  });

module.exports = (env) => {
  const mode = env.NODE_ENV;
  const sassStyleLoader =
    mode === "production"
      ? {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../../",
          },
        }
      : "style-loader";

  return {
    mode: mode,
    entry: {
      app: ["./src/assets/js/app.js", "./src/assets/scss/index.scss"],
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "./assets/js/[name].[hash].js",
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        Assets: path.resolve(__dirname, "src/assets/"),
      },
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            sassStyleLoader,
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
            loader: "url-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/fonts/",
              publicPath: "./assets/fonts/",
              esModule: false,
              options: {
                limit: 8192,
              },
            },
          },
        },
        {
          test: /.*font.*\.svg$/,
          use: {
            loader: "url-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "./assets/fonts/",
              publicPath: "./assets/fonts/",
              esModule: false,
            },
          },
        },
        {
          test: /^(?!.*font).*\.svg$/,
          use: {
            loader: "url-loader",
            options: {
              name: "[name].[ext]",
            },
          },
        },
        {
          test: /\.(jpe?g|png|gif|webp)$/,
          use: {
            loader: "file-loader",
            options: {
              name: "[name].[hash].[ext]",
              outputPath: "./assets/images/",
              esModule: false,
            },
          },
        },
        {
          test: /\.html$/,
          include: path.resolve(__dirname, "src/partials"),
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: false,
                attrs: ["img:src"],
              },
            },
          ],
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
      ...HtmlWebpackPluginConfigs,
      // new CopyWebpackPlugin({
      //   patterns: [
      //     {
      //       from: path.resolve(__dirname, "static"),
      //       to: path.resolve(__dirname, "dist"),
      //     },
      //   ],
      // }),
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
      contentBase: path.resolve(__dirname, "dist"),
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
