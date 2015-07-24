var ngParseModule = require('./module.js');

/**
 * @ngdoc object
 * @name ngParse.ParseUtils
 *
 * @requires $q
 *
 * @description
 * Utils.
 */
ParseUtilsService.$inject = ['$q'];
function ParseUtilsService($q) {
  this.wrapPromise = wrapPromise;
  this.wrapMethods = wrapMethods;
  this.defineAttributes = defineAttributes;

  /**
   * @ngdoc function
   * @name ngParse.ParseUtils#wrapPromise
   * @methodOf ngParse.ParseUtils
   *
   * @description
   * Wrap function that returns [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}
   * into function that returns $q promise.
   *
   * @param {function} func Function that returns
   * [Parse.Promise]{@link https://parse.com/docs/js/api/symbols/Parse.Promise.html}.
   *
   * @returns {function} Function that returns $q promise.
   */
  function wrapPromise(func) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      var promise = func.apply(this, args);
      return $q(promise.then.bind(promise));
    };
  }

  /**
   * @ngdoc function
   * @name wrapMethod
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
    object[methodName] = wrapPromise(object[methodName]);
  }

  /**
   * @ngdoc function
   * @name ngParse.ParseUtils#wrapMethods
   * @methodOf ngParse.ParseUtils
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

  /**
   * @ngdoc function
   * @name defineAttribute
   *
   * @description
   * Defines the attribute of an object.
   *
   * @param {object} object Object.
   * @param {string} attribute Attribute name.
   */
  function defineAttribute(object, attribute) {
    Object.defineProperty(object, attribute, {
      get: function () {
        return this.get(attribute);
      },
      set: function (value) {
        this.set(attribute, value);
      },
      configurable: true,
      enumerable: true
    });
  }

  /**
   * @ngdoc function
   * @name ngParse.ParseUtils#defineAttributes
   * @methodOf ngParse.ParseUtils
   *
   * @description
   * Defines the attributes of an object.
   *
   * @param {object} object Object.
   * @param {...string|string[]} attributes Attribute names.
   */
  function defineAttributes(object, attributes) {
    if (!(attributes instanceof Array)) {
      attributes = Array.prototype.slice.call(arguments, 1);
    }

    for (var i = 0, length = attributes.length; i < length; i++) {
      defineAttribute(object, attributes[i]);
    }
  }
}

module.exports = ngParseModule
  .service('ParseUtils', ParseUtilsService);
