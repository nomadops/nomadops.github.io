const path = require("path");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const glob = require("glob-all");

module.exports = {
  mode: "production",
  entry: "./src/index.html",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    usedExports: true,
  },
  plugins: [
    new PurgeCSSPlugin({
      paths: glob.sync([
        path.join(__dirname, "src/*.html"),
        path.join(__dirname, "src/**/*.js"),
      ]),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
    ],
  },
};
