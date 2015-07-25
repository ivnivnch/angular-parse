var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParsePromiseWrap.js');

/**
 * @ngdoc service
 * @name ngParse.ParseObject
 *
 * @requires ngParse.ParsePromiseWrap
 *
 * @description
 * This is a wrapper for
 * [Parse.Object]{@link https://parse.com/docs/js/api/symbols/Parse.Object.html}.
 */
ParseObjectFactory.$inject = ['ParsePromiseWrap'];
function ParseObjectFactory(ParsePromiseWrap) {
  var ParseObject = Parse.Object;

  if (!Parse.$$init) {
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

    ParsePromiseWrap.wrapMethods(ParseObject, ['destroyAll', 'fetchAll', 'fetchAllIfNeeded', 'saveAll']);
    ParsePromiseWrap.wrapMethods(ParseObject.prototype, ['destroy', 'fetch', 'save']);

    /**
     * @ngdoc method
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
     * @ngdoc method
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
  }

  return ParseObject;
}

module.exports = ngParseModule
  .factory('ParseObject', ParseObjectFactory);
