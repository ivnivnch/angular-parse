var Parse = require('parse');
var ParseMock = require('../src/ParseMock.js');

describe('Parse', function () {
  beforeEach(angular.mock.module('ngParse'));

  describe('provider', function () {
    var ParseProvider;

    beforeEach(function () {
      angular.module('ngParse.test', ['ngParse'])
        .config(function (_ParseProvider_) {
          ParseProvider = _ParseProvider_;
        });

      angular.mock.module('ngParse.test');
      angular.mock.inject(function () {
      });
    });

    it('should equal', function () {
      expect(ParseProvider.ACL).toEqual(Parse.ACL);
      expect(ParseProvider.Cloud).toEqual(Parse.Cloud);
      expect(ParseProvider.Config).toEqual(Parse.Config);
      expect(ParseProvider.Error).toEqual(Parse.Error);
      expect(ParseProvider.FacebookUtils).toEqual(Parse.FacebookUtils);
      expect(ParseProvider.File).toEqual(Parse.File);
      expect(ParseProvider.GeoPoint).toEqual(Parse.GeoPoint);
      expect(ParseProvider.Object).toEqual(Parse.Object);
      expect(ParseProvider.Promise).toEqual(Parse.Promise);
      expect(ParseProvider.Push).toEqual(Parse.Push);
      expect(ParseProvider.Query).toEqual(Parse.Query);
      expect(ParseProvider.Role).toEqual(Parse.Role);
      expect(ParseProvider.Session).toEqual(Parse.Session);
      expect(ParseProvider.User).toEqual(Parse.User);
    });

    describe('define attributes', function () {
      var Test;

      beforeEach(function () {
        Test = ParseProvider.Object.extend('Test');
      });

      it('should be defined', function () {
        expect(ParseProvider.defineAttributes).toBeDefined();
      });

      it('should define prototype attributes', function () {
        ParseProvider.defineAttributes(Test.prototype, ['a']);

        var object = new Test();
        object.set('a', 123);
        expect(object.get('a')).toBe(123);
        expect(object.a).toBe(123);
        object.a = 456;
        expect(object.a).toBe(456);
        expect(object.get('a')).toBe(456);
      });

      it('should define constructor attributes', function () {
        ParseProvider.defineAttributes(Test, ['b']);

        var object = new Test();
        object.set('b', 123);
        expect(object.get('b')).toBe(123);
        expect(object.b).toBe(123);
        object.b = 456;
        expect(object.b).toBe(456);
        expect(object.get('b')).toBe(456);
      });

      it('should define decorator attributes', function () {
        ParseProvider.defineAttributes(['c'])(Test);

        var object = new Test();
        object.set('c', 123);
        expect(object.get('c')).toBe(123);
        expect(object.c).toBe(123);
        object.c = 456;
        expect(object.c).toBe(456);
        expect(object.get('c')).toBe(456);
      });
    });
  });

  describe('factory', function () {
    it('should equal', function () {
      angular.mock.inject(function (_Parse_) {
        expect(_Parse_.ACL).toEqual(Parse.ACL);
        expect(_Parse_.Cloud).toEqual(Parse.Cloud);
        expect(_Parse_.Config).toEqual(Parse.Config);
        expect(_Parse_.Error).toEqual(Parse.Error);
        expect(_Parse_.FacebookUtils).toEqual(Parse.FacebookUtils);
        expect(_Parse_.File).toEqual(Parse.File);
        expect(_Parse_.GeoPoint).toEqual(Parse.GeoPoint);
        expect(_Parse_.Object).toEqual(Parse.Object);
        expect(_Parse_.Promise).toEqual(Parse.Promise);
        expect(_Parse_.Push).toEqual(Parse.Push);
        expect(_Parse_.Query).toEqual(Parse.Query);
        expect(_Parse_.Role).toEqual(Parse.Role);
        expect(_Parse_.Session).toEqual(Parse.Session);
        expect(_Parse_.User).toEqual(Parse.User);
      });
    });

    describe('define attributes', function () {
      angular.mock.inject(function (_Parse_) {
        expect(_Parse_.defineAttributes).toBeDefined();
      });
    });

    describe('promise', function () {
      it('should be defined', function () {
        angular.mock.inject(function (_Parse_) {
          expect(_Parse_.wrapObject).toBeDefined();
        });
      });
    });
  });
});
