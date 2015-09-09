var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseUtils', function () {
  beforeEach(module('ngParse'));

  beforeEach(function () {
    ParseInitialize();
  });

  describe('wrap', function () {
    it('should wrap', function () {
      var parsePromiseFunc = function () {
        return new Parse.Promise(function (resolve) {
          resolve(true);
        });
      };

      inject(function ($q, ParseUtils) {
        var wrappedPromiseFunc = ParseUtils.wrap(parsePromiseFunc);

        var wrappedPromise = wrappedPromiseFunc();
        var angularPromise = $q.resolve(true);

        expect(wrappedPromise).toEqual(angularPromise);
      });
    });
  });
});
