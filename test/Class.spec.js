var module = angular.mock.module;
var inject = angular.mock.inject;

describe('Class', function () {
  beforeEach(module('ngParse'));

  describe('equal', function () {
    it('should equal', function () {
      inject(function (ParseClass) {
        expect(ParseClass).toEqual(global.Parse.Class);
      });
    });
  });

  describe('create', function () {
    it('should create', function () {
      inject(function (ParseClass) {
        var TestParseClass = new ParseClass('Test');

        expect(TestParseClass).toEqual(jasmine.any(Function));
        expect(TestParseClass.prototype.className).toBe('Test');
      });
    });
  });

  describe('attributes', function () {
    beforeEach(function () {
      module(function ($provide) {
        $provide.factory('TestParseClass', function (ParseClass) {
          return ParseClass('TestParseClass', {
            $attributes: ['first', 'second', 'third']
          });
        });
      });
    });

    it('should create object with attributes', function () {
      inject(function (TestParseClass) {
        var test = new TestParseClass({
          first: 'first'
        });

        expect(test.get('first')).toBe('first');
        expect(test.get('other')).toBe(undefined);
      });
    });

    it('should work with parse/ES5 getters setters', function () {
      inject(function (TestParseClass) {
        var test = new TestParseClass({
          first: 'first'
        });

        expect(test.get('first')).toBe('first');
        expect(test.first).toBe('first');

        test.set('second', 'second');

        expect(test.get('second')).toBe('second');
        expect(test.second).toBe('second');

        test.third = 'third';

        expect(test.get('third')).toBe('third');
        expect(test.third).toBe('third');

        test.other = 'other';

        expect(test.get('other')).toBe(undefined);
        expect(test.other).toBe('other');

        test.set('another', 'another');

        expect(test.get('another')).toBe('another');
        expect(test.another).toBe(undefined);
      });
    });

    it('should define attributes', function () {
      inject(function (TestParseClass) {
        TestParseClass.defineAttributes('other', 'another');

        var test = new TestParseClass({
          other: 'other'
        });

        expect(test.get('other')).toBe('other');
        expect(test.other).toBe('other');

        test.other = 'new other';

        expect(test.get('other')).toBe('new other');
        expect(test.other).toBe('new other');

        test.another = 'another';

        expect(test.get('another')).toBe('another');
        expect(test.another).toBe('another');
      });
    });
  });

  describe('methods', function () {
    it('should create instance method', function () {
      module(function ($provide) {
        $provide.factory('TestParseClass', function (ParseClass) {
          return ParseClass('TestParseClass', {
            instanceMethod: function () {
              return 'ok';
            }
          });
        });
      });

      inject(function (TestParseClass) {
        var test = new TestParseClass();

        expect(test.instanceMethod).toEqual(jasmine.any(Function));
        expect(test.instanceMethod()).toBe('ok');
      });
    });

    it('should create class method', function () {
      module(function ($provide) {
        $provide.factory('TestParseClass', function (ParseClass) {
          return ParseClass('TestParseClass', null, {
            classMethod: function () {
              return 'ok';
            }
          });
        });
      });

      inject(function (TestParseClass) {
        expect(TestParseClass.classMethod).toEqual(jasmine.any(Function));
        expect(TestParseClass.classMethod()).toBe('ok');
      });
    });
  });

  describe('register', function () {
    it('should register & initialize', function () {
      var first_initialized = false, second_initialized = false, third_initialized;

      module(function ($provide) {
        $provide.factory('FirstParseClass', function (ParseClass) {
          first_initialized = true;

          return ParseClass('FirstParseClass');
        });

        $provide.factory('SecondParseClass', function (ParseClass) {
          second_initialized = true;

          return ParseClass('SecondParseClass');
        });

        $provide.factory('ThirdParseClass', function (ParseClass) {
          third_initialized = true;

          return ParseClass('ThirdParseClass');
        });
      });

      angular.module('ngParse.test', ['ngParse'])
        .config(function (ParseClassProvider) {
          ParseClassProvider.register('FirstParseClass', 'SecondParseClass');
          ParseClassProvider.register('ThirdParseClass');
        });

      module('ngParse.test');

      inject(function () {
        expect(first_initialized).toBe(true);
        expect(second_initialized).toBe(true);
        expect(third_initialized).toBe(true);
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
        return this;
      });

      inject(function (ParseClass) {
        var ParseTest = new ParseClass('Test', {
          $attributes: ['value']
        });

        var test = new ParseTest({id: id, value: value});

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

      inject(function (ParseClass) {
        var ParseTest = new ParseClass('Test', {
          $attributes: ['value']
        });

        var test = new ParseTest({id: id});

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

      inject(function (ParseClass) {
        var ParseTest = new ParseClass('Test', {
          $attributes: ['value']
        });

        var test = new ParseTest({id: id, value: value});

        test.destroy();

        expect(test.value).toEqual(undefined);
        expect(stub.callCount).toEqual(1);
      });
    });
  });
});
