require('angular');
require('angular-mocks');
require('parse');
require('../src/index.js');
require('../src/ParseMock.js');

var testsContext = require.context(__dirname, false, /\.spec\.js/);
testsContext.keys().forEach(testsContext);
