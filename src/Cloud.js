var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');

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

  if (Parse.$$init) return ParseCloud;

  ParseUtils.wrapMethods(ParseCloud, ['run']);

  return ParseCloud;
}

module.exports = ngParseModule
  .factory('ParseCloud', ParseCloudFactory);
