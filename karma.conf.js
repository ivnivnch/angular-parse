var webpack = require('webpack');

module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      './test/index.js',
      './test/*.spec.js'
    ],
    preprocessors: {
      './test/index.js': ['webpack'],
      './test/*.spec.js': ['webpack']
    },
    frameworks: ['jasmine', 'sinon'],
    plugins: [
      require('karma-webpack'),
      require('karma-jasmine'),
      require('karma-sinon'),
      require('karma-chrome-launcher')
    ],
    port: 9876,
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome'],
    client: {
      useIframe: true
    },
    webpack: {
      context: __dirname,
      target: 'web',
      devtool: '#inline-source-map',
      cache: true,
      watch: false,
      module: {
        noParse: [
          /sinon/
        ]
      },
      plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.NoErrorsPlugin()
      ]
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
