'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'myApp.list',
  'myApp.new',
  'myApp.welcome',
  'myApp.version',
  'myApp.datastub'
]).

// TODO: Replace ng-router with ui-router.  See http://www.funnyant.com/angularjs-ui-router/
// The bit about state machines is what we need...

config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
}]);
