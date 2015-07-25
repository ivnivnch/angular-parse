var module = angular.mock.module;
var inject = angular.mock.inject;

describe('Parse', function () {
  beforeEach(module('ngParse'));

  describe('equal', function () {
    it('should equal Parse', function () {
      inject(function (_Parse_) {
        expect(_Parse_).toEqual(Parse);
      });
    });
  });

  describe('initialize', function () {
    it('should initialize', function () {
      var applicationId = 'TEST_APP_ID', javaScriptKey = 'TEST_JS_KEY';

      angular.module('ngParse.test', ['ngParse'])
        .config(function (ParseProvider) {
          ParseProvider.initialize(applicationId, javaScriptKey);
        });

      module('ngParse.test');

      inject(function (Parse) {
        expect(Parse.applicationId).toBe(applicationId);
        expect(Parse.javaScriptKey).toBe(javaScriptKey);
      });
    });
  });

  describe('providers', function () {
    it('should be', function () {
      module(function (ParseProvider, ParseClassProvider, ParseFacebookUtilsProvider, ParseUserProvider) {
        expect(ParseProvider.Class).toBe(ParseClassProvider);
        expect(ParseProvider.FacebookUtils).toBe(ParseFacebookUtilsProvider);
        expect(ParseProvider.User).toBe(ParseUserProvider);
      });

      inject();
    });
  });
});
