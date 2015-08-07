'use strict';

angular.module('myApp.welcome', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('welcome', {
    url: '/',
    templateUrl: 'welcome/welcome.html',
    controller: 'WelcomeCtrl'
  });
}])

.controller('WelcomeCtrl', [function() {

}]);
