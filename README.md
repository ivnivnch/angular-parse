# Angular-Parse
Angular wrapper for [Parse.com JavaScript SDK](https://parse.com/docs/js/guide).
## Features
#### ES5 getters and setters for attributes
```javascript
var TestClass = new Parse.Class('Test', {
  $attributes: ['myAttr']
});

$scope.test = new TestClass();
$scope.test.myAttr = 'value';
console.assert($scope.test.myAttr == 'value');
console.assert($scope.test.get('myAttr') == 'value');
```
#### $q promise
```javascript
$scope.test.save()
  .then(function() {
    $scope.saved = true;
  })
  .catch(function(err) {});
```
## Installation
#### NPM
`npm install angular-parse`
## Setup
#### Browser
```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.min.js"></script>
<script src="https://parse.com/downloads/javascript/parse-1.5.0.min.js"></script>
<script src="path/to/angular-parse/angular-parse.js"></script>
<script>
  angular.module('demo', ['ngParse']);
</script>
```
#### CommonJS
`npm install angular parse angular-parse`
```javascript
var angular = require('angular');
var ngParse = require('angular-parse');
angular.module('demo', [ngParse]);
```
## Usage
#### Include `ngParse` module
```javascript
angular.module('demo', ['ngParse']);
```
#### Initialize Parse
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    ParseProvider.initialize(MY_PARSE_APP_ID, MY_PARSE_JS_KEY);
  }]);
```
#### Initialize Facebook
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
#### Define Class
```javascript
angular.module('demo')
  .factory('ParseCommentClass', ['Parse', function(Parse) {
    return new Parse.Class('Comment', {
      //attributes for which you want to create es5 getters and setters
      $attributes: ['user', 'text']
    });
  }])
  .config(['ParseProvider', function(ParseProvider) {
    //register factory
    ParseProvider.Class.register('ParseCommentClass');
  }]);
```
#### Define User attributes
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    //attributes for which you want to create es5 getters and setters
    ParseProvider.User.defineAttributes('first_name', 'last_name', 'picture', 'comments');
  }]);
```
#### Authenticate
```javascript
angular.module('demo')
  .run(['Parse', function(Parse) {
    if (!Parse.User.current()) {
      Parse.FacebookUtils.logIn('email', {})
        .then(function() {})
        .catch(function(err) {});
    }
  }]);
```
#### Class instance
```javascript
angular.module('demo')
  .controller('CommentController', ['$scope', 'Parse', 'ParseCommentClass', function($scope, Parse, ParseCommentClass) {
    var user = Parse.User.current();
    $scope.comment = new ParseCommentClass({user: user});
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
#### Query
```javascript
angular.module('demo')
  .controller('CommentsController', ['$scope', 'Parse', 'ParseCommentClass', function($scope, Parse, ParseCommentClass) {
    new Parse.Query(ParseCommentClass)
      .include('user')
      .find()
      .then(function(comments) {
        $scope.comments = comments;
      })
      .catch(function(err) {
        console.error(err);
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
#### Events
```javascript
angular.module('demo')
  .controller('MainController', ['$scope', 'Parse', function($scope, Parse) {
    var user = Parse.User.current();
    
    user.$on($scope, 'change', function() {
      $scope.userChanged = true;
    });
    
    user.name = 'new name';
    user.save();
  }]);
```
## Test
## License
[MIT](https://raw.githubusercontent.com/ivnivnch/angular-parse/master/LICENSE)
