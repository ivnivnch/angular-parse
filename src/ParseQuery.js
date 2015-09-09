var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseUtils.js');

/**
 * @ngdoc service
 * @name ngParse.ParseQuery
 *
 * @requires ngParse.ParseUtils
 *
 * @description
 * This is a wrapper for
 * [Parse.ParseQuery]{@link https://parse.com/docs/js/api/symbols/Parse.Query.html}.
 */
ParseQueryFactory.$inject = ['ParseUtils'];
function ParseQueryFactory(ParseUtils) {
  var ParseQuery = Parse.Query;

  ['count', 'find', 'first', 'get'].forEach(function (method) {
    ParseQuery.prototype[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseQuery.prototype[method]);
  });

  return ParseQuery;
}

ngParseModule
  .factory('ParseQuery', ParseQueryFactory);
