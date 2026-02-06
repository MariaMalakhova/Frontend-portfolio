const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base');

const config = {
  entry: './src/client/client.js',
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
};

module.exports = merge(baseConfig, config);
 