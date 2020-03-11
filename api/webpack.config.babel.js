const path = require("path");
const webpack = require("webpack");
const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/
      }
    ],
    noParse: [
      /pg\/lib\/native/,
      /knex\/lib\/dialects\/(mssql|mysql|mysql2|sqlite3|oracledb)/
    ]
  },
  externals: ["aws-sdk", "pg-query-stream"],
  plugins: [
    new webpack.DefinePlugin({
      "process.env.SERVERLESS": JSON.stringify(true)
    })
  ],
  optimization: {
    minimize: false
  },
  performance: {
    hints: false
  }
};
