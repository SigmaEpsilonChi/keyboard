const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].bundle.js',
  },
  devServer: {
    contentBase: './docs',
  },
  plugins: [
    new CleanWebpackPlugin(['docs'], {exclude: ['archive']}),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackBuildNotifierPlugin(),
    new HtmlWebpackPlugin({
      title: 'Isomorphic Keyboard'
    }),
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'src'),
    }, {
      test: [/\.css$/, /\.scss$/],
      loaders: ['style-loader', 'css-loader', 'sass-loader'],
    }, {
        test: /\.(png|jpg|jpeg)$/,
        loader: 'url-loader'
      }]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.json', '.png', '.jpg', '.jpeg']
  }
}