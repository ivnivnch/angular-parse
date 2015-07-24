var module = angular.mock.module;
var inject = angular.mock.inject;

describe('Object', function () {
  beforeEach(module('ngParse'));

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

  describe('isDirty', function () {
    it('should work', function () {
      inject(function (ParseObject) {
        var object = new ParseObject('Test', {
          id: 1
        });

        expect(object.isDirty()).toBe(false);

        object.set('value', 'new value');

        expect(object.isDirty()).toBe(true);
      });
    });
  });

  describe('isCreated', function () {
    it('should work', function () {
      inject(function (ParseObject) {
        var object = new ParseObject('Test', {
          id: 1
        });

        expect(object.isCreated()).toBe(false);

        object.createdAt = Date.now();

        expect(object.isCreated()).toBe(true);
      });
    });
  });

  describe('promises', function () {
    afterEach(function () {
      ParseMock.clearStubs();
    });

    it('should save', function () {
      var id = '1';
      var value = 'value';

      var stub = ParseMock.stubObjectSave(function (options) {
        if (options.objectId != id) return;
        this.createdAt = Date.now();
        return this;
      });

      inject(function (ParseObject) {
        var test = ParseObject('Test', {id: id, value: value});

        test.save();

        expect(test.value).toEqual(value);
        expect(stub.callCount).toEqual(1);
      });
    });

    it('should fetch', function () {
      var id = '1';
      var value = 'value';

      var stub = ParseMock.stubObjectFetch(function (options) {
        if (options.objectId != id) return;
        this.set('value', value);
        return this;
      });

      inject(function (ParseObject) {
        var test = ParseObject('Test', {id: id, value: value});

        test.fetch();

        expect(test.value).toEqual(value);
        expect(stub.callCount).toEqual(1);
      });
    });

    it('should destroy', function () {
      var id = '1';
      var value = 'value';

      var stub = ParseMock.stubObjectDestroy(function (options) {
        if (options.objectId != id) return;
        this.unset('value');
        return this;
      });

      inject(function (ParseObject) {
        var test = ParseObject('Test', {id: id, value: value});

        test.destroy();

        expect(test.value).toEqual(undefined);
        expect(stub.callCount).toEqual(1);
      });
    });
  });
});
