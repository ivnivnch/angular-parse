var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParsePromiseWrap', function () {
  beforeEach(module('ngParse'));

  describe('function', function () {
    it('should wrap', function () {
      var parsePromiseFunc = function () {
        return new Parse.Promise(function (resolve) {
          resolve(true);
        });
      };

      inject(function ($q, ParsePromiseWrap) {
        var wrappedPromiseFunc = ParsePromiseWrap.wrap(parsePromiseFunc);

        var wrappedPromise = wrappedPromiseFunc();
        var angularPromise = $q.resolve(true);

        expect(wrappedPromise).toEqual(angularPromise);
      });
    });
  });

  describe('methods', function () {
    var object;

    beforeEach(function () {
      object = {
        firstParsePromiseMethod: function () {
          return new Parse.Promise(function (resolve) {
            resolve(true);
          });
        },
        secondParsePromiseMethod: function () {
          return new Parse.Promise(function (resolve) {
            resolve(true);
          });
        }
      };
    });

    it('should wrap method', function () {
      inject(function ($q, ParsePromiseWrap) {
        ParsePromiseWrap.wrapMethod(object, 'firstParsePromiseMethod');

        var firstWrappedPromise = object.firstParsePromiseMethod();
        var angularPromise = $q.resolve(true);

        expect(firstWrappedPromise).toEqual(angularPromise);
      });
    });

    it('should wrap methods', function () {
      inject(function ($q, ParsePromiseWrap) {
        ParsePromiseWrap.wrapMethods(object, 'firstParsePromiseMethod', 'secondParsePromiseMethod');

        var firstWrappedPromise = object.firstParsePromiseMethod();
        var secondWrappedPromise = object.secondParsePromiseMethod();
        var angularPromise = $q.resolve(true);

        expect(firstWrappedPromise).toEqual(angularPromise);
        expect(secondWrappedPromise).toEqual(angularPromise);
      });
    });

    it('should wrap methods if array', function () {
      inject(function ($q, ParsePromiseWrap) {
        ParsePromiseWrap.wrapMethods(object, ['firstParsePromiseMethod', 'secondParsePromiseMethod']);

        var firstWrappedPromise = object.firstParsePromiseMethod();
        var secondWrappedPromise = object.secondParsePromiseMethod();
        var angularPromise = $q.resolve(true);

        expect(firstWrappedPromise).toEqual(angularPromise);
        expect(secondWrappedPromise).toEqual(angularPromise);
      });
    });
  });
});

