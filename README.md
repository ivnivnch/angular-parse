# Angular-Parse
Angular wrapper for [Parse.com JavaScript SDK](https://parse.com/docs/js/api/).
## Features
### Getters and setters for attributes
#### Define object attributes
```javascript
var object = new Parse.Object('Test');
Parse.defineAttributes(object, ['a', 'b', 'c']);
object.a = 123;
console.assert(object.a == 123);
console.assert(object.get('a') == 123);
```
#### Define subclass attributes
```javascript
var MyClass = Parse.Object.extend("ClassName");
Parse.defineAttributes(MyClass, ['a', 'b', 'c']);
var object = new MyClass();
object.a = 123;
console.assert(object.a == 123);
console.assert(object.get('a') == 123);
```
#### Use decorator
```javascript
@Parse.defineAttributes(['a', 'b', 'c'])
class MyClass extends Parse.Object {
  constructor() {
    super("ClassName");
  }
}
var object = new MyClass();
object.a = 123;
console.assert(object.a == 123);
console.assert(object.get('a') == 123);
```
### $q Promise
```javascript
object.save()
  .then(function() {
    $scope.saved = true;
  })
  .catch(function(err) {
    $scope.error = err;
  });
```
## Installation
### NPM
`npm install angular-parse`
## Setup
### Browser
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.6/angular.min.js"></script>
<script src="https://parse.com/downloads/javascript/parse-1.6.2.min.js"></script>
<script src="angular-parse/angular-parse.js"></script>
<script>
  angular.module('demo', ['ngParse']);
</script>
```
### CommonJS
`npm install angular parse angular-parse`
```javascript
var angular = require('angular');
var ngParse = require('angular-parse');
angular.module('demo', [ngParse]);
```
## Usage
### Include `ngParse` module
```javascript
angular.module('demo', ['ngParse']);
```
### Initialize Parse
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    ParseProvider.initialize(MY_PARSE_APP_ID, MY_PARSE_JS_KEY);
  }]);
```
### Initialize Facebook
```html
<script src="https://connect.facebook.net/en_US/sdk.js"></script>
```
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    ParseProvider.FacebookUtils.init({
      appId: MY_FACEBOOK_APP_ID,
      version: 'v2.4',//Currently available versions https://developers.facebook.com/docs/apps/changelog
      xfbml: false
    });
  }]);
```
### Subclass
```javascript
angular.module('demo')
  .factory('ParseComment', ['Parse', function(Parse) {
    var ParseComment = Parse.Object.extend('Comment', {/*...*/}, {/*...*/});
    Parse.defineAttributes(ParseComment, ['user', 'text']);
    
    /*
      Or use decorator with Babel https://babeljs.io/
      
      @Parse.defineAttributes('user', 'text')
      class ParseComment extends Parse.Object {
        constructor() {
          super("Comment");
        }
      }
      Parse.Object.registerSubclass('Comment', ParseComment);
    */
  }]);
```
### User attributes
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    ParseProvider.defineAttributes(ParseProvider.User, 'first_name', 'last_name', 'picture', 'comments');
  }]);
```
### Authenticate
```javascript
angular.module('demo')
  .run(['$rootScope', 'Parse', function($rootScope, Parse) {
    if (!Parse.User.authenticated()) {
      Parse.FacebookUtils.logIn('email', {})
        .then(function(user) {
          $rootScope.user = user;
        })
        .catch(function(err) {/*...*/});
    }
  }]);
```
### Class instance
```javascript
angular.module('demo')
  .controller('CommentController', ['$scope', 'Parse', 'ParseComment', function($scope, Parse, ParseComment) {
    var user = Parse.User.current();
    $scope.comment = new ParseComment();
    $scope.comment.set({user: user});
  }]);
```
```html
<form ng-controller="CommentController" ng-submit="comment.save()">
  <label>
    Comment
    <textarea ng-model="comment.text"></textarea>
  </label>
  <p>User: {{comment.user.username}}</p>
  <p>Created At: {{comment.createdAt}}</p>
  <input type="submit" value="Save"/>
</form>
```
### Query
```javascript
angular.module('demo')
  .controller('CommentsController', ['$scope', 'Parse', 'ParseCommentClass', function($scope, Parse, ParseComment) {
    new Parse.Query(ParseComment)
      .include('user')
      .find()
      .then(function(comments) {
        $scope.comments = comments;
      })
      .catch(function(err) {
        $scope.error = err;
      });
  }]);
```
```html
<div ng-controller="CommentsController">
  <div ng-repeat="comment in comments track by comment.$id">
    <p>User: {{comment.user.username}}</p>
    <img ng-src="comment.user.picture"/>
    <p>{{comment.text}}</p>
    <p>Created At: {{comment.createdAt}}</p>
  </div>
</div>
```
## License
[MIT](https://raw.githubusercontent.com/ivnivnch/angular-parse/master/LICENSE)
