require('angular');
require('angular-mocks');
var Parse = require('parse').Parse;
require('../src/index.js');
require('../src/ParseMock.js');

global.Parse = Parse;
global.ParseInitialize = function () {
  var applicationId = 'TEST_APP_ID', javaScriptKey = 'TEST_JS_KEY';
  Parse.initialize(applicationId, javaScriptKey);
};

var testsContext = require.context(__dirname, false, /\.spec\.js/);
testsContext.keys().forEach(testsContext);
