var Parse = require('parse');
require('./Parse.js');
var ngParseModule = require('./module.js');

/**
 * @ngdoc object
 * @name ngParse.ParseMockProvider
 *
 * @description
 * Provider for ParseMock service.
 */
ParseMockProvider.$inject = [];
function ParseMockProvider() {
  var provider = this;

  /**
   * @ngdoc service
   * @name ngParse.ParseMock
   *
   * @requires $q
   *
   * @description
   * Parse Mock.
   */
  provider.$get = ParseMockFactory;
  ParseMockFactory.$inject = ['$q'];
  function ParseMockFactory($q) {
    function ParseMock(cb) {
      return function () {
        var args = Array.prototype.slice.call(arguments, 0);
        try {
          return $q.resolve(cb.apply(this, args));
        } catch (err) {
          return $q.reject(err);
        }
      }
    }

    return ParseMock;
  }
}

ngParseModule
  .provider('ParseMock', ParseMockProvider);
