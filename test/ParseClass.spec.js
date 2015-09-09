var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseClass', function () {
  beforeEach(module('ngParse'));

  beforeEach(function () {
    ParseInitialize();
  });

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
        TestParseClass.defineAttributes('fourth', 'fifth');

        var test = new TestParseClass({
          fourth: 'fourth'
        });

        expect(test.get('fourth')).toBe('fourth');
        expect(test.fourth).toBe('fourth');

        test.fifth = 'fifth';

        expect(test.get('fifth')).toBe('fifth');
        expect(test.fifth).toBe('fifth');
      });
    });

    it('should define attributes for all classes', function () {
      module(function ($provide, ParseClassProvider) {
        $provide.factory('DemoParseClass', function (ParseClass) {
          return ParseClass('DemoParseClass', {
            $attributes: ['first']
          });
        });

        ParseClassProvider.defineAttributes('sixth', 'seventh');
      });

      inject(function (TestParseClass, DemoParseClass) {
        var test = new TestParseClass({
          sixth: 'sixth'
        });

        test.seventh = 'seventh';

        expect(test.get('sixth')).toBe('sixth');
        expect(test.get('seventh')).toBe('seventh');

        var demo = new DemoParseClass({
          sixth: 'sixth'
        });

        expect(demo.get('sixth')).toBe('sixth');
        expect(demo.sixth).toBe('sixth');

        demo.seventh = 'seventh';

        expect(demo.get('seventh')).toBe('seventh');
        expect(demo.seventh).toBe('seventh');
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
});
