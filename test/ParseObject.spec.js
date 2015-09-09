var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseObject', function () {
  beforeEach(module('ngParse'));

  beforeEach(function () {
    ParseInitialize();
  });

  describe('equal', function () {
    it('should equal Parse.Object', function () {
      inject(function (ParseObject) {
        expect(ParseObject).toEqual(global.Parse.Object);
      });
    });
  });

  describe('$id', function () {
    it('should $id to be id if not overwritten', function () {
      inject(function (ParseObject) {
        var object = new ParseObject('Test', {
          id: 1
        });

        expect(object.id).toBe(1);
        expect(object.$id).toBe(1);

        object.id = 2;

        expect(object.id).toBe(2);
        expect(object.$id).toBe(2);

        object.$id = 3;

        expect(object.id).toBe(2);
        expect(object.$id).toBe(3);
      });
    });
  });
});
