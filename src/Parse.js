var Parse = require('parse');
var ngParseModule = require('./module.js');

/**
 * @ngdoc object
 * @name ngParse.ParseProvider
 *
 * @description
 * Provider for Parse service.
 */
ParseProvider.$inject = [];
function ParseProvider() {
  /**
   * Defines getters and setters for the attributes
   * of the given object or function prototype.
   * Or create a decorator that defines getters
   * and setters for the subclass Parse.Object.
   *
   * @param {Object|Function|String|String[]} object
   * @param {...String|String[]=} attributes
   * @returns {*}
   */
  function defineAttributes(object, attributes) {
    if (object instanceof Parse.Object) {
      if (!(attributes instanceof Array)) attributes = Array.prototype.slice.call(arguments, 1);
      attributes.forEach(function (attribute) {
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
      });
    } else if (typeof object == 'function') {
      return defineAttributes(object.prototype, attributes)
    } else {
      if (object instanceof Array) attributes = object;
      else attributes = Array.prototype.slice.call(arguments, 0);
      return function defineAttributesDecorator(target) {
        defineAttributes(target, attributes);
      }
    }
  }

  // Parse
  var AngularParse = Object.create(Parse);

  // ParseUser
  defineAttributes(AngularParse.User, ['email', 'password', 'username']);

  var provider = AngularParse;

  /**
   * @ngdoc method
   * @name ngParse.ParseProvider#defineAttributes
   * @methodOf ngParse.ParseProvider
   * @static
   * @see {@link defineAttributes}
   */
  provider.defineAttributes = defineAttributes;

  /**
   * @ngdoc service
   * @name ngParse.Parse
   *
   * @requires $q
   *
   * @description
   * This is a wrapper for [Parse]{@link https://parse.com/docs/js/api/classes/Parse.html}.
   */
  provider.$get = ParseFactory;
  ParseFactory.$inject = ['$q'];
  function ParseFactory($q) {
    /**
     * Wraps Promise.
     *
     * @param {Object} promise
     * @param {Object} parsePromise
     * @returns {Object}
     */
    function wrapParsePromise(promise, parsePromise) {
      ['_rejected', '_rejectedCallbacks', '_resolved', '_resolvedCallbacks', '_result', 'reject', 'resolve']
        .forEach(function (prop) {
          promise[prop] = parsePromise[prop];
        });

      ['_continueWith', '_thenRunCallbacks', 'always', 'done', 'fail'].forEach(function (method) {
        promise[method] = wrap(parsePromise[method]);
      });

      ['then', 'catch'].forEach(function (method) {
        var func = promise[method];
        promise[method] = function wrappedAngularPromise() {
          var args = Array.prototype.slice.call(arguments, 0);
          var promise = func.apply(this, args);
          wrapParsePromise(promise, parsePromise);
          return promise;
        };
      });

      return promise;
    }

    /**
     * Wraps function.
     *
     * @param {Function} func Function that returns
     * [Parse.Promise]{@link https://parse.com/docs/js/api/classes/Parse.Promise.html}.
     * @returns {Function} Function that returns $q promises.
     */
    function wrap(func) {
      return function wrappedParsePromise() {
        var args = Array.prototype.slice.call(arguments, 0);
        var parsePromise = func.apply(this, args);
        var promise = $q(parsePromise.then.bind(parsePromise));
        wrapParsePromise(promise, parsePromise);
        return promise;
      };
    }

    /**
     * Wraps object.
     *
     * @param {Object} object
     * @param {...String|String[]=} methods
     */
    function wrapObject(object, methods) {
      if (!(methods instanceof Array)) methods = Array.prototype.slice.call(arguments, 1);
      methods.forEach(function (method) {
        object[method] = wrap(object[method]);
      });
    }

    /**
     * @ngdoc method
     * @name ngParse.Parse#wrapObject
     * @methodOf ngParse.Parse
     * @static
     * @see {@link wrapObject}
     */
    AngularParse.wrapObject = wrapObject;

    // ParseCloud
    wrapObject(AngularParse.Cloud, ['run']);

    // ParseConfig
    wrapObject(AngularParse.Config, ['get']);

    //FacebookUtils
    wrapObject(AngularParse.FacebookUtils, ['link', 'logIn', 'unlink']);

    // ParseFile
    wrapObject(AngularParse.File.prototype, ['save']);

    // ParseObject
    wrapObject(AngularParse.Object, ['destroyAll', 'fetchAll', 'fetchAllIfNeeded', 'saveAll']);
    wrapObject(AngularParse.Object.prototype, ['destroy', 'fetch', 'save']);

    // ParsePromise
    wrapObject(AngularParse.Promise, ['_continueWhile', 'as', 'error', 'when']);

    // ParsePush
    wrapObject(AngularParse.Push, ['send']);

    // ParseQuery
    wrapObject(AngularParse.Query.prototype, ['count', 'each', 'find', 'first', 'get']);

    // ParseSession
    wrapObject(AngularParse.Session, ['current']);

    // ParseUser
    wrapObject(AngularParse.User, ['become', 'currentAsync', 'enableRevocableSession', 'logIn', 'logOut', 'requestPasswordReset', 'signUp']);
    wrapObject(AngularParse.User.prototype, ['logIn', 'signUp']);

    return AngularParse;
  }

  return provider;
}

ngParseModule
  .provider('Parse', ParseProvider);
