var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');

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
   * @ngdoc service
   * @name ngParse.ParseUser
   *
   * @requires ngParse.ParseUtils
   *
   * @description
   * This is a wrapper for
   * [Parse.ParseUser]{@link https://parse.com/docs/js/api/symbols/Parse.User.html}.
   */
  provider.$get = $get;
  $get.$inject = ['ParseUtils'];
  function $get(ParseUtils) {
    var ParseUser = Parse.User;

    if (Parse.$$init) return ParseUser;

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
      },
      auth: {
        get: function () {
          return this.authenticated();
        },
        configurable: true,
        enumerable: false
      },
      current: {
        get: function () {
          return this.isCurrent();
        },
        configurable: true,
        enumerable: false
      }
    });

    ParseUser.defineAttributes = ParseUtils.defineAttributes.bind(ParseUtils, ParseUser.prototype);

    ParseUtils.wrapMethods(ParseUser, ['become', 'enableRevocableSession', 'logIn', 'logOut', 'requestPasswordReset', 'signUp']);
    ParseUtils.wrapMethods(ParseUser.prototype, ['logIn', 'signUp']);

    return ParseUser;
  }
}

module.exports = ngParseModule
  .provider('ParseUser', ParseUserProvider);
