var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseUtils.js');

/**
 * @ngdoc object
 * @name ngParse.ParseFacebookUtilsProvider
 *
 * @description
 * Provider for ParseFacebookUtils service.
 */
ParseFacebookUtilsProvider.$inject = [];
function ParseFacebookUtilsProvider() {
  var provider = this;

  /**
   * @ngdoc property
   * @name ngParse.ParseFacebookUtilsProvider#FacebookUtils
   * @propertyOf ngParse.ParseFacebookUtilsProvider
   *
   * @description
   * See [FacebookUtils]{@link https://parse.com/docs/js/api/symbols/Parse.FacebookUtils.html}
   */
  provider.FacebookUtils = Parse.FacebookUtils;

  /**
   * @ngdoc method
   * @name ngParse.ParseFacebookUtilsProvider#initialize
   * @alias ngParse.ParseFacebookUtilsProvider#init
   * @methodOf ngParse.ParseFacebookUtilsProvider
   *
   * @description
   * Initializes Parse Facebook integration.
   * See [`Parse.FacebookUtils.init`]{@link https://parse.com/docs/js/api/symbols/Parse.FacebookUtils.html#.init}.
   *
   * @param {Object} options Facebook options argument.
   * See [`Parse.FacebookUtils.init`]{@link https://parse.com/docs/js/api/symbols/Parse.FacebookUtils.html#.init}.
   */
  provider.initialize = provider.init = function (options) {
    Parse.FacebookUtils.init(options);
  };

  /**
   * @ngdoc object
   * @name ngParse.ParseFacebookUtils
   *
   * @requires ngParse.ParseUtils
   *
   * @description
   * This is a wrapper for
   * [Parse.FacebookUtils]{@link https://parse.com/docs/js/api/symbols/Parse.FacebookUtils.html}.
   */
  provider.$get = ParseFacebookUtilsFactory;
  ParseFacebookUtilsFactory.$inject = ['ParseUtils'];
  function ParseFacebookUtilsFactory(ParseUtils) {
    var ParseFacebookUtils = Parse.FacebookUtils;

    ['link', 'logIn', 'unlink'].forEach(function (method) {
      ParseFacebookUtils[ParseUtils.wrapPrefix + method] = ParseUtils.wrap(ParseFacebookUtils[method]);
    });

    return ParseFacebookUtils;
  }
}

ngParseModule
  .provider('ParseFacebookUtils', ParseFacebookUtilsProvider);
