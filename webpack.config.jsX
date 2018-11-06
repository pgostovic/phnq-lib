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

  entry: {
    // lastfm: path.resolve(__dirname, 'src/lastfm/index.js'),
    // spotify: path.resolve(__dirname, 'src/spotify/index.js'),
    // wikipedia: path.resolve(__dirname, 'src/wikipedia/index.js'),
    // bandsintown: path.resolve(__dirname, 'src/bandsintown/index.js'),
    // songkick: path.resolve(__dirname, 'src/songkick/index.js'),
    // sendgrid: path.resolve(__dirname, 'src/sendgrid/index.js'),
    // cache: path.resolve(__dirname, 'src/cache.js'),
    // collections: path.resolve(__dirname, 'src/collections.js'),
    color: path.resolve(__dirname, 'src/color.js'),
    // datetime: path.resolve(__dirname, 'src/datetime.js'),
    // location: path.resolve(__dirname, 'src/location.js'),
    // log: path.resolve(__dirname, 'src/log.js'),
    // model: path.resolve(__dirname, 'src/model.js'),
    // mongo: path.resolve(__dirname, 'src/mongo.js'),
    // state: path.resolve(__dirname, 'src/state.jsx'),
    url: path.resolve(__dirname, 'src/url.js'),
    // wait: path.resolve(__dirname, 'src/wait.js'),
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

  output: {
    filename: '[name].client.js',
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd',
  },
};

const serverConfig = {
  ...config,

  target: 'node',

  output: {
    filename: '[name].server.js',
    path: path.resolve(__dirname, 'dist'),
    library: '[name]',
    libraryTarget: 'umd',
  },
};

module.exports = [clientConfig, serverConfig];
