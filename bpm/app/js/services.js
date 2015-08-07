'use strict';

/* Services */

angular.module('myApp.services', ['myApp.service.login', 'myApp.service.firebase', 'waitForAuth', 'bpmAdmin'])

    .service('$alert', ['$rootScope', function ($rootScope) {

        var alerts = [];

        $rootScope.$on('$locationChangeSuccess', function() {
            clearAlerts();
        });

        var clearAlerts = function () {
            alerts = [];
        };

        var closeAlert = function (index, clearOthers) {
            alerts.splice(index, 1);
        };

        var createAlert = function (type, message, clearOthers) {
            if (clearOthers)
                alerts = [];

            alerts.push({type: type, msg: message});
        };

        var alertSuccess = function (message, clearOthers) {
            clearOthers = clearOthers || true;
            createAlert('success', message, clearOthers);
        };

        var alertInfo = function (message, clearOthers) {
            clearOthers = clearOthers || true;
            createAlert('info', message, clearOthers);
        };

        var alertWarning = function (message, clearOthers) {
            clearOthers = clearOthers || true;
            createAlert('warning', message, clearOthers);
        };

        var alertDanger = function (message, clearOthers) {
            clearOthers = clearOthers || true;
            createAlert('danger', message, clearOthers);
        };

        return {
            $alerts: function () {
                return alerts;
            },
            $success: function (message, clearOthers) {
                return alertSuccess(message, clearOthers);
            },
            $info: function (message, clearOthers) {
                return alertInfo(message, clearOthers);
            },
            $warning: function (message, clearOthers) {
                return alertWarning(message, clearOthers);
            },
            $danger: function (message, clearOthers) {
                return alertDanger(message, clearOthers);
            },
            $clear: function () {
                return clearAlerts();
            },
            $close: function (index) {
                return closeAlert(index);
            }
        };
    }])

    .service('$dm', ['syncData', '$filter', function(syncData, $filter) {
        var bowls = [];
        var invitations = [];
        var pathsToLoadAtInit = [];
        var profile = [];
        var pools = [];
        var teams = [];
        var users = [];

        function inArray(haystack, needle, field) {
            var result = [];
            var item, i;
            for (i = 0; i < haystack.length; i++) {
                item = haystack[i];
                var fieldValue = item[field];
                if (needle[fieldValue])
                    result.push(item);
            }

            return (result);
        }

        return {
            getMyPools: function(id) {
                var userPools = syncData('users/' + $scope.auth.user.uid + '/pools/');


            },

            getTeam: function(id) {
                return teams[id];
            },

            getTeams: function () {
                return teams;
            },

            getUsersForPool: function() {
                var poolUsers = syncData('/pools/' + $routeParams.id + '/users');
            },

            init: function(userId) {
                for (var i = 0; i < pathsToLoadAtInit.length; i++) {
                    var val
                }

                invitations = $filter('orderByPriority')(syncData('invitations/' + userId));
                profile = $filter('orderByPriority')(syncData('profile'));
                pools = $filter('orderByPriority')(syncData('pools'));
                teams = $filter('orderByPriority')(syncData('teams'));
            },

            loadAtInit: function(path) {
                pathsToLoadAtInit.push(path);
            }
        }
    }]);