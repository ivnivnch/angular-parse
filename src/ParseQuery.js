var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParsePromiseWrap.js');

/**
 * @ngdoc service
 * @name ngParse.ParseQuery
 *
 * @requires ngParse.ParsePromiseWrap
 *
 * @description
 * This is a wrapper for
 * [Parse.ParseQuery]{@link https://parse.com/docs/js/api/symbols/Parse.Query.html}.
 */
ParseQueryFactory.$inject = ['ParsePromiseWrap'];
function ParseQueryFactory(ParsePromiseWrap) {
  var ParseQuery = Parse.Query;

  if (!Parse.$$init) {
    ParsePromiseWrap.wrapMethods(ParseQuery.prototype, ['count', 'each', 'find', 'first', 'get']);
  }

  return ParseQuery;
}

module.exports = ngParseModule
  .factory('ParseQuery', ParseQueryFactory);
