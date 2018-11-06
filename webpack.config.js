const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const analyzeBundle = process.env.ANALYZE_BUNDLE === 'true';

const config = {
  mode: 'production',

  externals: {
    react: 'react',
    'prop-types': 'prop-types',
    chalk: 'chalk',
    process: 'process',
    'cross-fetch': 'cross-fetch',
    mongodb: 'mongodb',
    'continuation-local-storage': 'continuation-local-storage',
    md5: 'md5',
    'pretty-hrtime': 'pretty-hrtime',
    sendgrid: 'sendgrid',
  },

  //  ['@babel/polyfill', path.resolve(__dirname, 'index.js')],
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

  entry: path.resolve(__dirname, 'index.client.js'),

  output: {
    filename: 'index.client.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
};

const serverConfig = {
  ...config,

  target: 'node',

  entry: path.resolve(__dirname, 'index.server.js'),

  output: {
    filename: 'index.server.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
};

module.exports = [clientConfig, serverConfig];
// module.exports = [clientConfig];
