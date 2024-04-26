const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    popup: path.resolve("src", "popup", "popup.tsx"),
    options: path.resolve("src", "options", "options.tsx"),
    background: path.resolve("src", "background", "background.ts"),
    contentScript: path.resolve("src", "contentScript", "contentScript.ts"),
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    }
  },
  module: {
    rules: [
      {
        use: "ts-loader",
        test: /\.tsx$/,
        exclude: /node_modules/,
      },
      {
        use: ["style-loader", "css-loader"],
        test: /\.css$/,
        exclude: /node_modules/,
      },
      {
        type: "asset/resource",
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve("src", "static"),
          to: path.resolve("dist"),
        }
      ]
    }),
    ...getHtmlPlugins([
      "popup",
      "options",
      "background",
      "contentScript",
    ]),
  ],
};

function getHtmlPlugins(chunks) {
  return chunks.map(chunk => new HtmlPlugin({
    title: "Extension boilerplate",
    filename: `${chunk}.html`,
    chunks: [chunk],
  }));
}
