var angular = require('angular');

/**
 * @ngdoc overview
 * @name ngParse
 *
 * @description
 * # ngParse
 * Angular wrapper for [Parse.com JavaScript SDK]{@link https://parse.com/docs/js/guide}.
 *
 * <pre>
 * <!doctype html>
 * <html ng-app="demo">
 * <head>
 *   <script src="path/to/angular.js"></script>
 *   <!-- Include the ngParse script -->
 *   <script src="path/to/angular-parse.js"></script>
 *   <script>
 *     // add 'ngParse' as a dependency
 *     angular.module('demo', ['ngParse']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
var ngParseModule = angular.module('ngParse', []);

module.exports = ngParseModule;
