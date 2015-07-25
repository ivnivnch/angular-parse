var angular = require('angular');
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
   * @ngdoc property
   * @name ngParse.ParseClassProvider#$attributes
   * @propertyOf ngParse.ParseClassProvider
   *
   * @description
   * The names of the attributes to create getters and setters.
   */
  provider.$attributes = [];

  /**
   * @ngdoc method
   * @name ngParse.ParseClassProvider#register
   * @methodOf ngParse.ParseClassProvider
   *
   * @description
   * Register factories, which create Parse classes.
   * It may be helpful to Initialize Parse classes before using.
   *
   * @param {...string|string[]} classes Class names for registration.
   */
  provider.register = function (classes) {
    if (!angular.isArray(classes)) {
      classes = Array.prototype.slice.call(arguments);
    }

    for (var i = 0, length = classes.length; i < length; i++) {
      provider.$classes[classes[i]] = classes[i];
    }
  };

  /**
   * @ngdoc method
   * @name ngParse.ParseClassProvider#defineAttributes
   * @methodOf ngParse.ParseClassProvider
   *
   * @description
   * Defines attributes for all classes.
   *
   * @param {...string|string[]} attributes Class names for registration.
   */
  provider.defineAttributes = function (attributes) {
    if (!angular.isArray(attributes)) {
      attributes = Array.prototype.slice.call(arguments);
    }

    union(provider.$attributes, attributes);
  };

  /**
   * @ngdoc service
   * @name ngParse.ParseClass
   *
   * @description
   * This is a wrapper for
   * [`Parse.Object.extend`]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html#.extend}.
   * Creates a new subclass of Parse.Object for the given Parse class name.
   */
  provider.$get = $get;
  $get.$inject = [];
  function $get() {
    var extend = Parse.Object.extend.bind(Parse.Object);

    function ParseClass(className, protoProps, classProps) {
      var parseClass = extend(className, protoProps, classProps);
      var attributes = angular.isObject(protoProps) && angular.isArray(protoProps.$attributes) ?
        protoProps.$attributes : [];

      defineAttributes(parseClass, attributes);

      return parseClass;
    }

    /**
     * @ngdoc method
     * @name ngParse.ParseClass#defineAttributes
     * @methodOf ngParse.ParseClass
     *
     * @description
     * Defines the attributes of the class.
     *
     * @param {object} Class Subclass of Parse.Object.
     * @param {...string|string[]} attributes Attribute names.
     */
    ParseClass.defineAttributes = defineAttributes;
    function defineAttributes(Class, attributes) {
      if (!angular.isArray(attributes)) {
        attributes = Array.prototype.slice.call(arguments, 1);
      }

      Class.$attributes = [];

      Class.defineAttributes = function (attributes) {
        if (!angular.isArray(attributes)) {
          attributes = Array.prototype.slice.call(arguments);
        }

        attributes.forEach(function (attribute) {
          Object.defineProperty(Class.prototype, attribute, {
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

        union(Class.$attributes, attributes);
      };

      Class.defineAttributes(provider.$attributes);
      Class.defineAttributes(attributes);
    }

    /**
     * @ngdoc property
     * @name ngParse.ParseClassProvider#$classes
     * @propertyOf ngParse.ParseClass
     *
     * @description
     * Registered classes.
     */
    ParseClass.$classes = provider.$classes;

    Parse.Class = ParseClass;

    return ParseClass;
  }
}

/**
 * Creates an array of unique values, in order,
 * from all of the provided arrays.
 */
function union() {
  var dst = angular.isArray(arguments[0]) && arguments[0] || [];
  var src = Array.prototype.slice.call(arguments, 1);

  for (var i = 0, srcLength = src.length, arr; i < srcLength; i++) {
    arr = src[i];
    if (!angular.isArray(arr)) continue;
    for (var j = 0, arrLength = arr.length, val; j < arrLength; j++) {
      val = arr[j];
      if (dst.indexOf(val) == -1) dst.push(val);
    }
  }

  return dst;
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
    if (typeof ParseClass.$classes[i] != 'string') continue;
    ParseClass.$classes[i] = $injector.get(i);
  }
}

module.exports = ngParseModule
  .provider('ParseClass', ParseClassProvider)
  .run(init);
