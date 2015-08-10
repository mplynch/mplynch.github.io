'use strict';

angular.module('myApp.new', ['ui.router', 'myApp.datastub'])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider

    .state('new', {
    abstract: true,
    url: '/new',
    templateUrl: 'new/new.html',
    controller: 'NewCtrl'
  })

  .state('new.type', {
    url: '/new-type',
    templateUrl: 'new/new-type.html',
    controller: 'NewCtrl'
  })

  .state('new.actiontype', {
    url: '/actiontype',
    templateUrl: 'new/new-actiontype.html',
  })

  .state('new.source', {
    url: '/source',
    templateUrl: 'new/new-source.html'
  })

  .state('new.description', {
    url: '/description',
    templateUrl: 'new/new-description.html'
  })

  .state('new.supervisor', {
    url: '/supervisor',
    templateUrl: 'new/new-supervisor.html'
  })

  .state('new.review', {
    url: '/review',
    templateUrl: 'new/new-review.html'
  })

  .state('new.finished', {
    url: '/finished',
    templateUrl: 'new/new-finished.html'
  });
}])

.controller('NewCtrl', ['$scope', '$state', 'datastub', '$log', function($scope, $state, datastub, $log) {
  $scope.suggestion = {};
  $scope.types = datastub.types;
  $scope.actiontypes = datastub.actiontypes;
  $scope.locations = datastub.locations;
  $scope.sources = datastub.sources;
  $scope.supervisors = datastub.supervisors;

  var stateOrder = ['new.type', 'new.actiontype', 'new.source', 'new.description', 'new.supervisor', 'new.review'];
  var currentState = stateOrder[0];

  $scope.goToNextState = function() {
    // TODO: Validate data and dynamically go to next state
  };

  $scope.goToPreviousState = function() {
    // TODO: Go to previous state
  };

  $scope.processForm = function() {
    datastub.AddSuggestion($scope.suggestion);

    $state.go('new.finished');
  };

}]);
