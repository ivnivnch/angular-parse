var ngParseModule = require('./module.js');

ParseUtilsProvider.$inject = [];
function ParseUtilsProvider() {
  var provider = this;

  provider.wrapPrefix = '';

  /**
   * @ngdoc object
   * @name ngParse.ParseUtils
   *
   * @requires $q
   *
   * @description
   * Parse Utils.
   */
  ParseUtilsService.$inject = ['$q'];
  provider.$get = ParseUtilsService;
  function ParseUtilsService($q) {
    if (!(this instanceof ParseUtilsService)) return new ParseUtilsService($q);

    this.wrapPrefix = provider.wrapPrefix;

    /**
     * @ngdoc method
     * @name ngParse.ParseUtils#wrap
     * @methodOf ngParse.ParseUtils
     *
     * @description
     * Wrap function that returns
     * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}
     * into function that returns $q promise.
     *
     * @param {Function} func Function that returns
     * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}.
     *
     * @returns {function} Function that returns $q promise.
     */
    this.wrap = function (func) {
      return function () {
        var args = Array.prototype.slice.call(arguments);
        var promise = func.apply(this, args);
        return $q(promise.then.bind(promise));
      };
    }
  }
}


ngParseModule
  .provider('ParseUtils', ParseUtilsProvider);
