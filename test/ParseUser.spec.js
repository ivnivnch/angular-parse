var module = angular.mock.module;
var inject = angular.mock.inject;

describe('ParseUser', function () {
  beforeEach(module('ngParse'));

  describe('equal', function () {
    it('should equal Parse.User', function () {
      inject(function (ParseUser) {
        expect(ParseUser).toEqual(global.Parse.User);
      });
    });
  });

  describe('attributes', function () {
    it('should create user with attributes', function () {
      inject(function (ParseUser) {
        var user = new ParseUser({
          username: 'username',
          password: 'password',
          email: 'email'
        });

        expect(user.getUsername()).toBe('username');
        expect(user.get('password')).toBe('password');
        expect(user.getEmail()).toBe('email');
      });
    });

    it('should work with parse/ES5 getters setters', function () {
      inject(function (ParseUser) {
        var user = new ParseUser({
          username: 'username'
        });

        expect(user.getUsername()).toBe('username');
        expect(user.username).toBe('username');

        user.username = 'new username';

        expect(user.getUsername()).toBe('new username');
        expect(user.username).toBe('new username');

        user.setEmail('email');

        expect(user.getEmail()).toBe('email');
        expect(user.email).toBe('email');

        user.password = 'password';

        expect(user.get('password')).toBe('password');
        expect(user.password).toBe('password');

        user.other = 'other';

        expect(user.get('other')).toBe(undefined);
        expect(user.other).toBe('other');

        user.set('another', 'another');

        expect(user.get('another')).toBe('another');
        expect(user.another).toBe(undefined);
      });
    });

    it('should define attributes', function () {
      inject(function (ParseUser) {
        ParseUser.defineAttributes('name', 'avatar');

        var user = new ParseUser({
          name: 'name'
        });

        expect(user.get('name')).toBe('name');
        expect(user.name).toBe('name');

        user.avatar = 'avatar';

        expect(user.get('avatar')).toBe('avatar');
        expect(user.avatar).toBe('avatar');
      });
    });

    it('should define attributes in provider', function () {
      module(function (ParseUserProvider) {
        ParseUserProvider.defineAttributes('first_name', 'last_name');
      });

      inject(function (ParseUser) {
        var user = new ParseUser({
          first_name: 'first_name'
        });

        expect(user.get('first_name')).toBe('first_name');
        expect(user.first_name).toBe('first_name');

        user.last_name = 'last_name';

        expect(user.get('last_name')).toBe('last_name');
        expect(user.last_name).toBe('last_name');
      });
    });
  });
});
