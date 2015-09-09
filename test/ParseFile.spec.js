var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseFile', function () {
  beforeEach(module('ngParse'));

  beforeEach(function () {
    ParseInitialize();
  });

  describe('equal', function () {
    it('should equal Parse.File', function () {
      inject(function (ParseFile) {
        expect(ParseFile).toEqual(global.Parse.File);
      });
    });
  });
});
