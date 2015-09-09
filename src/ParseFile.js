var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseUtils.js');

/**
 * @ngdoc service
 * @name ngParse.ParseFile
 *
 * @requires ngParse.ParseUtils
 *
 * @description
 * This is a wrapper for
 * [Parse.ParseFile]{@link https://parse.com/docs/js/api/symbols/Parse.File.html}.
 */
ParseFileFactory.$inject = ['ParseUtils'];
function ParseFileFactory(ParseUtils) {
  var ParseFile = Parse.File;

  ['save'].forEach(function (method) {
    ParseFile.prototype[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseFile.prototype[method]);
  });

  return ParseFile;
}

ngParseModule
  .factory('ParseFile', ParseFileFactory);
