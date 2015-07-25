var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseFacebookUtils', function () {
  beforeEach(module('ngParse'));

  describe('equal', function () {
    it('should equal Parse.FacebookUtils', function () {
      inject(function (ParseFacebookUtils) {
        expect(ParseFacebookUtils).toEqual(global.Parse.FacebookUtils);
      });
    });
  });

  describe('initialize', function () {
    it('should be defined', function () {
      angular.module('ngParse.test', ['ngParse'])
        .config(function (ParseFacebookUtilsProvider) {
          expect(ParseFacebookUtilsProvider.init).toBeDefined();
        });

      module('ngParse.test');

      inject();
    });
  });
});
