const path = require('path');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  optimization: {
    usedExports: true,
  },
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/dist/',
  },
  devServer: {
    contentBase: path.resolve(__dirname),
    watchContentBase: false,
    publicPath: '/dist/',
    hotOnly: true,
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.js(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', { modules: false }],
            },
          },
        ],
      },
    ],
  },
};
