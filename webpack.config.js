const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'examples/src'),
  entry: {
    app: path.resolve(__dirname, 'examples/src/app.js'),
  },
  output: {
    path: path.resolve(__dirname, 'examples/dist'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'examples/dist'),
    compress:false,
    port:4000,
    hot:true,
  },
  resolve: {
    alias: {
      'react-select': path.resolve(__dirname, 'src/index.js'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'stage-0', 'react'],
          },
        }],
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','less-loader'],
        }),
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          }
        ]
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: 2,
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject:false,
      template: path.resolve(__dirname, 'examples/src/index.html')
    }),
    new ExtractTextPlugin('example.css'),
  ],
};
