var Parse = require('parse').Parse;
var ngParseModule = require('./module.js');
require('./ParseClass.js');
require('./ParseCloud.js');
require('./ParseFacebookUtils');
require('./ParseFile');
require('./ParseObject.js');
require('./ParseQuery.js');
require('./ParseUser.js');
require('./ParseUtils.js');

/**
 * @ngdoc object
 * @name ngParse.ParseProvider
 *
 * @requires ngParse.ParseClassProvider
 * @requires ngParse.ParseFacebookUtilsProvider
 * @requires ngParse.ParseUserProvider
 *
 * @description
 * Provider for Parse service.
 */
ParseProvider.$inject = ['ParseClassProvider', 'ParseFacebookUtilsProvider', 'ParseUserProvider'];
function ParseProvider(ParseClassProvider, ParseFacebookUtilsProvider, ParseUserProvider) {
  var provider = this;

  /**
   * @ngdoc property
   * @name ngParse.ParseProvider#Parse
   * @propertyOf ngParse.ParseProvider
   */
  provider.Parse = Parse;

  /**
   * @ngdoc property
   * @name ngParse.ParseProvider#Class
   * @propertyOf ngParse.ParseProvider
   */
  provider.Class = ParseClassProvider;

  /**
   * @ngdoc property
   * @name ngParse.ParseProvider#FacebookUtils
   * @propertyOf ngParse.ParseProvider
   */
  provider.FacebookUtils = ParseFacebookUtilsProvider;

  /**
   * @ngdoc property
   * @name ngParse.ParseProvider#User
   * @propertyOf ngParse.ParseProvider
   */
  provider.User = ParseUserProvider;

  /**
   * @ngdoc method
   * @name ngParse.ParseProvider#initialize
   * @methodOf ngParse.ParseProvider
   *
   * @description
   * Initializes Parse.
   * See [Parse.initialize]{@link https://parse.com/docs/js/api/symbols/Parse.html#.initialize}.
   *
   * @param {String} applicationId Your Parse Application ID.
   * @param {String} javaScriptKey Your Parse JavaScript Key.
   */
  provider.initialize = function (applicationId, javaScriptKey) {
    Parse.initialize(applicationId, javaScriptKey);
  };

  /**
   * @ngdoc object
   * @name ngParse.Parse
   *
   * @requires ngParse.ParseClass
   * @requires ngParse.ParseCloud
   * @requires ngParse.ParseFacebookUtils
   * @requires ngParse.ParseFile
   * @requires ngParse.ParseObject
   * @requires ngParse.ParseQuery
   * @requires ngParse.ParseUser
   * @requires ngParse.ParseUtils
   *
   * @description
   * This is a wrapper for [Parse]{@link https://parse.com/docs/js/api/symbols/Parse.html}.
   */
  provider.$get = ParseFactory;
  ParseFactory.$inject = [
    'ParseClass',
    'ParseCloud',
    'ParseFacebookUtils',
    'ParseFile',
    'ParseObject',
    'ParseQuery',
    'ParseUser',
    'ParseUtils'
  ];
  function ParseFactory() {
    return Parse;
  }
}

/**
 * @ngdoc function
 * @name init
 *
 * @requires ngParse.Parse
 *
 * @description
 * Initializes ngParse.
 */
init.$inject = ['Parse'];
function init() {
}

ngParseModule
  .provider('Parse', ParseProvider)
  .run(init);
