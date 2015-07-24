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
```javascript
angular.module('demo')
  .config(['ParseProvider', function(ParseProvider) {
    ParseProvider.FacebookUtils.init({
      appId: MY_FACEBOOK_APP_ID,
    });
  }]);
```
#### Define Classes
```javascript
angular.module('demo')
  .factory('ParseCommentClass', ['Parse', function(Parse) {
    return new Parse.Class('Comment', {
      $attributes: ['user', 'text']
    });
  }])
  .config(['ParseProvider', function(ParseProvider) {
    //register factory
    ParseProvider.Class.register('ParseCommentClass');
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
    var user = Parse.User.current();
    new Parse.Query(ParseCommentClass)
      .equalTo('user', user)
      .include('user')
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
    <p>{{comment.text}}</p>
    <p>User: {{comment.user.username}}</p>
    <p>Created At: {{comment.createdAt}}</p>
  </div>
</div>
```
## License
MIT
