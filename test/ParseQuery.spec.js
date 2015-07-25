var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseQuery', function () {
  beforeEach(module('ngParse'));

  describe('equal', function () {
    it('should equal Parse.Query', function () {
      inject(function (ParseQuery) {
        expect(ParseQuery).toEqual(global.Parse.Query);
      });
    });
  });

  describe('promises', function () {
    afterEach(function () {
      ParseMock.clearStubs();
    });

    it('should find', function () {
      var _result = [new Parse.Object('User', {id: '1', username: 'Username'})];

      var stub = ParseMock.stubQueryFind(function () {
        return _result;
      });

      inject(function (ParseQuery) {
        var result;

        new ParseQuery('User')
          .find()
          .then(function (response) {
            result = response;
          });

        expect(result).toEqual(_result);
        expect(stub.callCount).toEqual(1);
      });
    });

    it('should first', function () {
      var _result = new Parse.Object('User', {id: '1', username: 'Username'});

      var stub = ParseMock.stubQueryFirst(function () {
        return _result;
      });

      inject(function (ParseQuery) {
        var result;

        new ParseQuery('User')
          .first()
          .then(function (response) {
            result = response;
          });

        expect(result).toEqual(_result);
        expect(stub.callCount).toEqual(1);
      });
    });

    it('should get', function () {
      var _result = new Parse.Object('User', {id: '1', username: 'Username'});

      var stub = ParseMock.stubQueryGet(function () {
        return _result;
      });

      inject(function (ParseQuery) {
        var result;

        new ParseQuery('User')
          .get('1')
          .then(function (response) {
            result = response;
          });

        expect(result).toEqual(_result);
        expect(stub.callCount).toEqual(1);
      });
    });

    it('should count', function () {
      var _result = 1;

      var stub = ParseMock.stubQueryCount(function () {
        return _result;
      });

      inject(function (ParseQuery) {
        var result;

        new ParseQuery('User')
          .count()
          .then(function (response) {
            result = response;
          });

        expect(result).toEqual(_result);
        expect(stub.callCount).toEqual(1);
      });
    });
  });
});
