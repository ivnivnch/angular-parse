var module = angular.mock.module;
var inject = angular.mock.inject;

describe('Utils', function () {
  beforeEach(module('ngParse'));

  describe('promises', function () {
    it('should wrap promise', function () {
      var parsePromiseFunc = function () {
        return new Parse.Promise(function (resolve) {
          resolve(true);
        });
      };

      inject(function ($q, ParseUtils) {
        var wrappedPromiseFunc = ParseUtils.wrapPromise(parsePromiseFunc);

        var wrappedPromise = wrappedPromiseFunc();
        var angularPromise = $q.resolve(true);

        expect(wrappedPromise).toEqual(angularPromise);
      });
    });

    describe('wrap methods', function () {
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

      it('should wrap promise methods', function () {
        inject(function ($q, ParseUtils) {
          ParseUtils.wrapMethods(object, 'firstParsePromiseMethod', 'secondParsePromiseMethod');

          var firstWrappedPromise = object.firstParsePromiseMethod();
          var secondWrappedPromise = object.secondParsePromiseMethod();
          var angularPromise = $q.resolve(true);

          expect(firstWrappedPromise).toEqual(angularPromise);
          expect(secondWrappedPromise).toEqual(angularPromise);
        });
      });

      it('should wrap promise methods if array', function () {
        inject(function ($q, ParseUtils) {
          ParseUtils.wrapMethods(object, ['firstParsePromiseMethod', 'secondParsePromiseMethod']);

          var firstWrappedPromise = object.firstParsePromiseMethod();
          var secondWrappedPromise = object.secondParsePromiseMethod();
          var angularPromise = $q.resolve(true);

          expect(firstWrappedPromise).toEqual(angularPromise);
          expect(secondWrappedPromise).toEqual(angularPromise);
        });
      });
    });
  });

  describe('attributes', function () {
    it('should define attributes', function () {
      var object = {};

      inject(function (ParseUtils) {
        ParseUtils.defineAttributes(object, 'first', 'second');

        var props = Object.getOwnPropertyNames(object);

        expect(props).toContain('first');
        expect(props).toContain('second');
      });
    });

    it('should define attributes if array', function () {
      var object = {};

      inject(function (ParseUtils) {
        ParseUtils.defineAttributes(object, ['first', 'second']);

        var props = Object.getOwnPropertyNames(object);

        expect(props).toContain('first');
        expect(props).toContain('second');
      });
    });
  });
});

