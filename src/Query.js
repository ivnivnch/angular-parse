var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');

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

  if (Parse.$$init) return ParseQuery;

  ParseUtils.wrapMethods(ParseQuery.prototype, ['count', 'each', 'find', 'first', 'get']);

  return ParseQuery;
}

module.exports = ngParseModule
  .factory('ParseQuery', ParseQueryFactory);
