const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const analyzeBundle = process.env.ANALYZE_BUNDLE === 'true';

const config = {
  mode: 'production',
  devtool: 'source-map',

  externals: [nodeExternals()],

  output: {
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'umd',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

if (analyzeBundle) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

const clientConfig = {
  ...config,
  target: 'web',
  entry: path.resolve(__dirname, '../index.client.js'),
  output: {
    ...config.output,
    filename: 'index.client.js',
  },
};

const serverConfig = {
  ...config,
  target: 'node',
  entry: path.resolve(__dirname, '../index.server.js'),
  output: {
    ...config.output,
    filename: 'index.server.js',
  },
};

module.exports = [clientConfig, serverConfig];
