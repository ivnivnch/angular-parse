var angular = require('angular');
var Parse = require('parse').Parse;
var utils = require('./utils.js');
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
   * @param {...String|String[]} classes Class names for registration.
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
   * @param {...String|String[]} attributes Class names for registration.
   */
  provider.defineAttributes = function (attributes) {
    if (!angular.isArray(attributes)) {
      attributes = Array.prototype.slice.call(arguments);
    }

    utils.union(provider.$attributes, attributes);
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
  provider.$get = ParseClassFactory;
  ParseClassFactory.$inject = [];
  function ParseClassFactory() {
    var extend = Parse.Object.extend;

    function ParseClass(className, protoProps, classProps) {
      protoProps = Object(protoProps);

      var parseClass = extend.call(Parse.Object, className, protoProps, classProps);
      var attributes = angular.isArray(protoProps.$attributes) ? protoProps.$attributes : [];

      defineAttributes(parseClass, attributes);

      return parseClass;
    }

    /**
     * @ngdoc method
     * @name ngParse.ParseClass#defineAttributes
     * @methodOf ngParse.ParseClass
     * @static
     *
     * @description
     * Defines the attributes of the class.
     *
     * @param {Object} Class Subclass of Parse.Object.
     * @param {...String|String[]} attributes Attribute names.
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

        utils.union(Class.$attributes, attributes);
      };

      Class.defineAttributes(provider.$attributes);
      Class.defineAttributes(attributes);
    }

    /**
     * @ngdoc property
     * @name ngParse.ParseClassProvider#$classes
     * @propertyOf ngParse.ParseClass
     * @static
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

ngParseModule
  .provider('ParseClass', ParseClassProvider)
  .run(init);
