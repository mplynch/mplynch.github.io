'use strict';

angular.module('myApp.list', ['ui.router', 'ui.grid', 'myApp.datastub'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('list', {
    url: '/list',
    templateUrl: 'list/list.html',
    controller: 'ListCtrl'
  });
}])

.controller('ListCtrl', ['$scope', 'datastub', '$log', function($scope, datastub, $log) {
  $scope.suggestions = datastub.suggestions;
  $log.log(datastub.suggestions);

  $scope.isGridVisible = function() {
    return $scope.length > 0;
  }
}]);
