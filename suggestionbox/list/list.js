'use strict';

angular.module('myApp.list', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl'
  });
}])

.controller('ListCtrl', [function() {

}]);
