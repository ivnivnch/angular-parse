var ngParseModule = require('./module.js');

/**
 * @ngdoc object
 * @name ngParse.ParsePromiseWrap
 *
 * @requires $q
 *
 * @description
 * Wrap [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}.
 */
ParsePromiseWrapService.$inject = ['$q'];
function ParsePromiseWrapService($q) {
  this.wrap = wrap;
  this.wrapMethod = wrapMethod;
  this.wrapMethods = wrapMethods;

  /**
   * @ngdoc method
   * @name ngParse.ParsePromiseWrap#wrap
   * @methodOf ngParse.ParsePromiseWrap
   *
   * @description
   * Wrap function that returns
   * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}
   * into function that returns $q promise.
   *
   * @param {function} func Function that returns
   * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}.
   *
   * @returns {function} Function that returns $q promise.
   */
  function wrap(func) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var promise = func.apply(this, args);
      return $q(promise.then.bind(promise));
    };
  }

  /**
   * @ngdoc method
   * @name ngParse.ParsePromiseWrap#wrapMethod
   * @methodOf ngParse.ParsePromiseWrap
   *
   * @description
   * Wrap object method that returns
   * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}
   * into function that returns $q promise.
   *
   * @param {object} object Object.
   * @param {string} methodName Method name.
   */
  function wrapMethod(object, methodName) {
    object[methodName] = wrap(object[methodName]);
  }

  /**
   * @ngdoc method
   * @name ngParse.ParsePromiseWrap#wrapMethods
   * @methodOf ngParse.ParsePromiseWrap
   *
   * @description
   * Wrap each object method that returns
   * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}
   * into function that returns $q promise.
   *
   * @param {object} object Object.
   * @param {...string|string[]} methodNames Method names.
   */
  function wrapMethods(object, methodNames) {
    if (!(methodNames instanceof Array)) {
      methodNames = Array.prototype.slice.call(arguments, 1);
    }

    for (var i = 0, length = methodNames.length; i < length; i++) {
      wrapMethod(object, methodNames[i]);
    }
  }
}

module.exports = ngParseModule
  .service('ParsePromiseWrap', ParsePromiseWrapService);
