const path = require('path');
const webpack = require('webpack');

const srcPath = './src';
const distPath = './dist';

module.exports = {
  entry: {
    request: path.resolve(__dirname, 'index.js')
  },
  output: {
    path: path.resolve(__dirname, distPath),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js']
  },
  devtool: process.env.NODE_ENV !== 'production' ? 'cheap-eval-source-map' : false,
  watch: process.env.NODE_ENV !== 'production',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, srcPath)
        ],
        exclude: [
          path.resolve(__dirname, distPath)
        ],
        query: {
          presets: ['env', 'stage-2'],
          plugins: [
            'transform-runtime'
          ]
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: process.env.NODE_ENV !== 'production',
      compress: {
        warnings: false
      }
    })
  ]
}
