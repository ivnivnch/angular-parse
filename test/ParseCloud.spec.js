var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseCloud', function () {
  beforeEach(module('ngParse'));

  beforeEach(function () {
    ParseInitialize();
  });

  describe('equal', function () {
    it('should equal Parse.Cloud', function () {
      inject(function (ParseCloud) {
        expect(ParseCloud).toEqual(global.Parse.Cloud);
      });
    });
  });
});
