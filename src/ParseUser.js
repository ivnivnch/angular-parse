var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseClass.js');
require('./ParseUtils.js');

/**
 * @ngdoc object
 * @name ngParse.ParseUserProvider
 *
 * @description
 * Provider for ParseUser service.
 */
ParseUserProvider.$inject = [];
function ParseUserProvider() {
  var provider = this;
  provider.User = Parse.User;

  /**
   * @ngdoc property
   * @name ngParse.ParseUserProvider#$attributes
   * @propertyOf ngParse.ParseUserProvider
   *
   * @description
   * The names of the attributes to create getters and setters.
   */
  provider.$attributes = [];

  /**
   * @ngdoc method
   * @name ngParse.ParseUserProvider#register
   * @methodOf ngParse.ParseUserProvider
   *
   * @description
   * Checks whether this user is the current user and has been authenticated.
   */
  provider.authenticated = function () {
    return Boolean(Parse.User.current());
  };

  /**
   * @ngdoc method
   * @name ngParse.ParseUserProvider#defineAttributes
   * @methodOf ngParse.ParseUserProvider
   *
   * @description
   * Defines attributes for Parse.User.
   *
   * @param {...String|String[]} attributes Class names for registration.
   */
  provider.defineAttributes = function (attributes) {
    if (!(attributes instanceof Array)) {
      attributes = Array.prototype.slice.call(arguments);
    }

    provider.$attributes.push.apply(provider.$attributes, attributes);
  };

  /**
   * @ngdoc service
   * @name ngParse.ParseUser
   *
   * @requires ngParse.ParseUtils
   * @requires ngParse.ParseClass
   *
   * @description
   * This is a wrapper for
   * [Parse.ParseUser]{@link https://parse.com/docs/js/api/symbols/Parse.User.html}.
   */
  provider.$get = ParseUserFactory;
  ParseUserFactory.$inject = ['ParseUtils', 'ParseClass'];
  function ParseUserFactory(ParseUtils, ParseClass) {
    var ParseUser = Parse.User;

    Object.defineProperties(ParseUser.prototype, {
      username: {
        get: function () {
          return this.getUsername();
        },
        set: function (value) {
          this.setUsername(value);
        },
        configurable: true,
        enumerable: true
      },
      password: {
        get: function () {
          return this.get('password');
        },
        set: function (value) {
          this.setPassword(value);
        },
        configurable: true,
        enumerable: true
      },
      email: {
        get: function () {
          return this.getEmail();
        },
        set: function (value) {
          this.setEmail(value);
        },
        configurable: true,
        enumerable: true
      }
    });

    ['become', 'enableRevocableSession', 'logIn', 'logOut', 'requestPasswordReset', 'signUp'].forEach(function (method) {
      ParseUser[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseUser[method]);
    });

    ['logIn', 'signUp'].forEach(function (method) {
      ParseUser.prototype[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseUser.prototype[method]);
    });

    ParseClass.defineAttributes(ParseUser, provider.$attributes);

    ParseClass.$classes['ParseUser'] = ParseUser;

    return ParseUser;
  }
}

ngParseModule
  .provider('ParseUser', ParseUserProvider);
