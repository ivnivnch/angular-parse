var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      './test/index.js'
    ],
    preprocessors: {
      './test/index.js': ['webpack']
    },
    frameworks: ['jasmine'],
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-chrome-launcher')
    ],
    port: 9876,
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome'],
    webpack: {
      context: __dirname,
      target: 'web',
      devtool: '#inline-source-map',
      cache: true,
      watch: false,
      plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.NoErrorsPlugin()
      ]
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
