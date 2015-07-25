var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParsePromiseWrap.js');

/**
 * @ngdoc object
 * @name ngParse.ParseCloud
 *
 * @requires ngParse.ParsePromiseWrap
 *
 * @description
 * This is a wrapper for
 * [Parse.Cloud]{@link https://parse.com/docs/js/api/symbols/Parse.Cloud.html}.
 */
ParseCloudFactory.$inject = ['ParsePromiseWrap'];
function ParseCloudFactory(ParsePromiseWrap) {
  var ParseCloud = Parse.Cloud;

  if (!Parse.$$init) {
    ParsePromiseWrap.wrapMethods(ParseCloud, ['run']);
  }

  return ParseCloud;
}

module.exports = ngParseModule
  .factory('ParseCloud', ParseCloudFactory);
