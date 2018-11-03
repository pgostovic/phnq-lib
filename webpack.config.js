const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const analyzeBundle = process.env.ANALYZE_BUNDLE === 'true';

const config = {
  mode: 'production',

  // entry: {
  //   api: ['babel-polyfill', path.resolve(__dirname, '../src/main.js')],
  //   landing: ['babel-polyfill', path.resolve(__dirname, '../src/landing.js')],
  // },
  // output: {
  //   filename: 'api/[name].js',
  //   path: path.resolve(__dirname, '../dist'),
  //   publicPath: apiRoot,
  //   library: 'edgt',
  // },

  externals: {
    react: 'react',
    'prop-types': 'prop-types',
    chalk: 'chalk',
    process: 'process',
    'cross-fetch': 'cross-fetch',
    mongodb: 'mongodb',
  },

  entry: {
    cache: path.resolve(__dirname, 'lib/cache.js'),
    collections: path.resolve(__dirname, 'lib/collections.js'),
    color: path.resolve(__dirname, 'lib/color.js'),
    datetime: path.resolve(__dirname, 'lib/datetime.js'),
    location: path.resolve(__dirname, 'lib/location.js'),
    log: path.resolve(__dirname, 'lib/log.js'),
    model: path.resolve(__dirname, 'lib/model.js'),
    mongo: path.resolve(__dirname, 'lib/mongo.js'),
    state: path.resolve(__dirname, 'lib/state.jsx'),
    url: path.resolve(__dirname, 'lib/url.js'),
  },
  //  ['@babel/polyfill', path.resolve(__dirname, 'index.js')],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
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
      {
        test: /\.css$/,
        loader: 'raw-loader',
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

module.exports = {
  ...config,
};
