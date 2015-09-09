var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseUtils.js');

/**
 * @ngdoc service
 * @name ngParse.ParseObject
 *
 * @requires $rootScope
 * @requires ngParse.ParseUtils
 *
 * @description
 * This is a wrapper for
 * [Parse.Object]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html}.
 */
ParseObjectFactory.$inject = ['$rootScope', 'ParseUtils'];
function ParseObjectFactory($rootScope, ParseUtils) {
  var ParseObject = Parse.Object;

  Object.defineProperty(ParseObject.prototype, '$id', {
    get: function () {
      return this.$$id === undefined || this.$$id === null ? this.id : this.$$id;
    },
    set: function (value) {
      this.$$id = value;
    },
    configurable: true,
    enumerable: false
  });

  ['destroyAll', 'fetchAll', 'fetchAllIfNeeded', 'saveAll'].forEach(function (method) {
    ParseObject[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseObject[method]);
  });

  ['destroy', 'fetch', 'save'].forEach(function (method) {
    ParseObject.prototype[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseObject.prototype[method]);
  });

  /**
   * @ngdoc method
   * @name ngParse.ParseObject#$on
   * @methodOf ngParse.ParseObject
   *
   * @description
   * Bind event.
   *
   * @param {Object} $scope Angular $scope.
   * @param {String} eventName Event name.
   * @param {Function} callback Callback function.
   * @param {Object=} context Callback context.
   * @returns {Function} Unbind function.
   */
  ParseObject.prototype.$on = function ($scope, eventName, callback, context) {
    if (!($scope instanceof $rootScope.constructor)) throw TypeError("$scope is not instanceof Scope");
    if (typeof eventName != 'string') throw TypeError("eventName is not string");
    if (typeof callback != 'function') throw TypeError("callback is not function");

    var _callback = function () {
      var args = Array.prototype.slice.call(arguments);
      $scope.$applyAsync(callback.bind(context, args));
    };

    this.on(eventName, _callback, context);

    var off = this.off.bind(this, eventName, _callback, context);
    $scope.$on('$destroy', off);

    return off;
  };

  return ParseObject;
}

ngParseModule
  .factory('ParseObject', ParseObjectFactory);
