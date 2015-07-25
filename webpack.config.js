var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: './src/index.js',
  output: {
    filename: 'angular-parse.js',
    path: '.'
  },
  externals: {
    angular: 'window.angular',
    parse: 'window.Parse && window'
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
  target: 'web',
  devtool: '#inline-source-map',
  cache: true,
  watch: false
};
