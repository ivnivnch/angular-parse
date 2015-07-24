var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');

/**
 * @ngdoc service
 * @name ngParse.ParseObject
 *
 * @requires ngParse.ParseUtils
 *
 * @description
 * This is a wrapper for
 * [Parse.Object]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html}.
 */
ParseObjectFactory.$inject = ['ParseUtils'];
function ParseObjectFactory(ParseUtils) {
  var ParseObject = Parse.Object;

  if (Parse.$$init) return ParseObject;

  Object.defineProperty(ParseObject.prototype, '$id', {
    get: function () {
      return this.$$id === undefined || this.$$id === null ? this.id : this.$$id;
    },
    set: function (value) {
      this.$$id = value;
    },
    configurable: false,
    enumerable: false
  });

  ParseUtils.wrapMethods(ParseObject, ['destroyAll', 'fetchAll', 'fetchAllIfNeeded', 'saveAll']);
  ParseUtils.wrapMethods(ParseObject.prototype, ['destroy', 'fetch', 'save']);

  //conflict with ParseUser.prototype.defineAttributes
  //ParseObject.defineAttributes = ParseUtils.defineAttributes.bind(ParseUtils, ParseObject.prototype);

  /**
   * @ngdoc function
   * @name ngParse.ParseObject.prototype#isDirty
   * @methodOf ngParse.ParseObject.prototype
   *
   * @description
   * Check whether the object is dirty.
   *
   * @returns {boolean} Returns true if object is dirty.
   */
  ParseObject.prototype.isDirty = function () {
    return Boolean(this.dirtyKeys().length);
  };

  /**
   * @ngdoc function
   * @name ngParse.ParseObject.prototype#isCreated
   * @methodOf ngParse.ParseObject.prototype
   *
   * @description
   * Check whether the object is created.
   *
   * @returns {boolean} Returns true if object is created.
   */
  ParseObject.prototype.isCreated = function () {
    return Boolean(this.createdAt);
  };

  return ParseObject;
}

module.exports = ngParseModule
  .factory('ParseObject', ParseObjectFactory);
