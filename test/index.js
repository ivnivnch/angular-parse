var angular = require('angular');
require('angular-mocks');
var Parse = require('parse').Parse;
var ParseMock = require('./parse-mock.js');
require('../src/index.js');

global.Parse = Parse;
global.ParseMock = ParseMock;
global.module = angular.mock.module;
global.inject = angular.mock.inject;

var testsContext = require.context(__dirname, false, /\.spec\.js/);
testsContext.keys().forEach(testsContext);
