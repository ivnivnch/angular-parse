var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseUtils.js');

/**
 * @ngdoc object
 * @name ngParse.ParseCloud
 *
 * @requires ngParse.ParseUtils
 *
 * @description
 * This is a wrapper for
 * [Parse.Cloud]{@link https://parse.com/docs/js/api/symbols/Parse.Cloud.html}.
 */
ParseCloudFactory.$inject = ['ParseUtils'];
function ParseCloudFactory(ParseUtils) {
  var ParseCloud = Parse.Cloud;

  ['run'].forEach(function (method) {
    ParseCloud[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseCloud[method]);
  });

  return ParseCloud;
}

ngParseModule
  .factory('ParseCloud', ParseCloudFactory);
