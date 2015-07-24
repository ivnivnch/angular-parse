var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');

/**
 * @ngdoc object
 * @name ngParse.ParseClassProvider
 *
 * @description
 * Provider for ParseClass service.
 */
ParseClassProvider.$inject = [];
function ParseClassProvider() {
  var provider = this;

  /**
   * @ngdoc property
   * @name ngParse.ParseClassProvider#$classes
   * @propertyOf ngParse.ParseClassProvider
   *
   * @description
   * Class names for registration.
   */
  provider.$classes = {};

  /**
   * @ngdoc method
   * @name ngParse.ParseClassProvider#register
   * @methodOf ngParse.ParseClassProvider
   *
   * @description
   * Register factories, which create Parse classes.
   * It may be helpful to Initialize Parse classes before using.
   *
   * <pre>
   * angular.module('demo', ['ngParse'])
   *   .factory('FirstParseClass', ['ParseClass', function(ParseClass) {
   *     return new ParseClass('First', {...});
   *   }])
   *   .factory('SecondParseClass', ['ParseClass', function(ParseClass) {
   *     return new ParseClass('Second', {...});
   *   }])
   *   .config(['ParseClassProvider', function(ParseClassProvider) {
   *     ParseClassProvider.register('FirstParseClass', 'SecondParseClass');
   *   }]);
   * </pre>
   *
   * @param {...string|string[]} classes Class names for registration.
   */
  provider.register = function (classes) {
    if (!(classes instanceof Array)) {
      classes = Array.prototype.slice.call(arguments);
    }

    for (var i = 0, length = classes.length; i < length; i++) {
      provider.$classes[classes[i]] = classes[i];
    }
  };

  /**
   * @ngdoc service
   * @name ngParse.ParseClass
   *
   * @requires ngParse.ParseUtils
   *
   * @description
   * This is a wrapper for
   * [`Parse.Object.extend`]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html#.extend}.
   * Creates a new subclass of Parse.Object for the given Parse class name.
   *
   * <pre>
   * // class definition with $attributes
   * var DemoClass = new ParseClass('Demo', {
   *   $attributes: ['first', 'second', ...]
   * });
   *
   * var demoObject = new DemoClass();
   *
   * // attribute setter
   * demoObject.set('first', 'first value');
   *
   * // $attributes getter
   * var val = demoObject.first;
   * console.assert(val == 'first value');
   *
   * // $attributes setter
   * demoObject.first = 'other value';
   *
   * // attribute getter
   * var val = demoObject.get('first');
   * console.assert(val == 'other value');
   * </pre>
   *
   * @param {string} className The name of the Parse class.
   * @param {object=} protoProps [Instance properties]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html#constructor}.
   * @param {string[]=} protoProps.$attributes Defines ES5 getters and setters for the attributes.
   * @param {object=} classProps [Static class properties]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html#constructor}.
   */
  provider.$get = $get;
  $get.$inject = ['ParseUtils'];
  function $get(ParseUtils) {
    var extend = Parse.Object.extend.bind(Parse.Object);

    function ParseClass(className, protoProps, classProps) {
      var parseClass = extend(className, protoProps, classProps);

      if (protoProps && typeof protoProps == 'object') {
        if (protoProps.$attributes instanceof Array) {
          ParseUtils.defineAttributes(parseClass.prototype, protoProps.$attributes);
        }
      }

      parseClass.defineAttributes = ParseUtils.defineAttributes.bind(ParseUtils, parseClass.prototype);

      return parseClass;
    }

    ParseClass.$classes = provider.$classes;

    Parse.Class = ParseClass;

    return ParseClass;
  }
}

/**
 * @ngdoc function
 * @name init
 *
 * @requires $injector
 * @requires ngParse.ParseClass
 *
 * @description
 * Initializes registered classes.
 */
init.$inject = ['$injector', 'ParseClass'];
function init($injector, ParseClass) {
  for (var i in ParseClass.$classes) {
    if (!ParseClass.$classes.hasOwnProperty(i)) continue;
    ParseClass.$classes[i] = $injector.get(i);
  }
}

module.exports = ngParseModule
  .provider('ParseClass', ParseClassProvider)
  .run(init);
