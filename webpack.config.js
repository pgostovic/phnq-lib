const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const analyzeBundle = process.env.ANALYZE_BUNDLE === 'true';

const config = {
  mode: 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, 'index.js')],
  output: {
    filename: 'phnq-lib.js',
    path: path.resolve(__dirname, 'dist'),
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
