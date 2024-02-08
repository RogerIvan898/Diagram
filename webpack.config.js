const path = require('path')
const HtmlWebpakPlagin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'App.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  devServer: {
    static: path.resolve(__dirname, 'build')
  },
  plugins: [
    new HtmlWebpakPlagin({template: path.resolve(__dirname, 'main.html')})
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}