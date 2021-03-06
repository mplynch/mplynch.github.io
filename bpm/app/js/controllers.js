'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('AlertCtrl', ['$scope', '$alert',
        function ($scope, $alert) {
            $scope.alerts = $alert.$alerts();

            $scope.$watch(
                function () {
                    return $alert.$alerts()
                },
                function (alerts) {
                    $scope.alerts = alerts;
                });

            $scope.closeAlert = function (index) {
                $alert.$close(index);
            };
        }])

    .controller('BowlsCtrl', ['$scope', '$location', 'syncData', '$modal', '$alert',
        function ($scope, $location, syncData, $modal, $alert) {
            $scope.teams = syncData('teams');

            $scope.seasons = syncData('seasons');

            var settings = syncData('settings');

            settings.$on("loaded", function () {
                $scope.setCurrentSeason(settings.currentSeason);
            });

            $scope.openCalendar = function ($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
            };

            $scope.setCurrentSeason = function (season) {
                $scope.bowls = syncData('seasons/' + season + '/bowls/');

                $scope.bowls.$on("loaded", function () {
                    $scope.currentSeason = season;
                });
            };

            $scope.remove = function (bowl) {
                bowl.$remove();
            };

            $scope.edit = function (bowl) {
                var selectedBowl = syncData('seasons/' + settings.currentSeason + '/bowls/' + bowl.$id);

                console.log(selectedBowl.date);

                var modalInstance = $modal.open({
                    templateUrl: 'partials/bowls.edit.html',
                    controller: 'ModalEditorCtrl',
                    resolve: {
                        items: function () {
                            return selectedBowl;
                        }
                    }});

                modalInstance.result.then(function (result) {
                    selectedBowl.$save().then(function () {
                            $alert.$success('Saved bowl!')
                        },
                        function () {
                            $alert.$danger('Failed to save bowl!');
                        })
                });
            };
        }])

    .controller('HomeCtrl', ['$scope',
        function ($scope) {

        }])

    .controller('InvitationsCtrl', ['$scope', 'syncData', 'firebaseRef', '$alert',
        function ($scope, syncData, firebaseRef, $alert) {
            $scope.invitations = syncData('invitations/' + $scope.auth.user.uid);

            $scope.pools = syncData('pools');

            $scope.accept = function (pool) {
                firebaseRef('/users/' + $scope.auth.user.uid + '/pools/' + pool.$id).set(true);
                $scope.invitations.$remove(pool.$id);
                $alert.$success('Invitation accepted!');
                console.log('invitation accepted');
            };

            $scope.reject = function (pool) {
                $scope.invitations.$remove(pool.$id);
                console.log('invitation removed');
            };
        }])

    .controller('LoginCtrl', ['$scope', 'loginService', '$location', '$alert',
        function ($scope, loginService, $location, $alert) {
            $scope.name = null;
            $scope.email = null;
            $scope.pass = null;
            $scope.confirm = null;
            $scope.createMode = false;

            $scope.login = function (cb) {
                if (!$scope.email) {
                    $alert.$danger('Please enter an email address');
                }
                else if (!$scope.pass) {
                    $alert.$danger('Please enter a password');
                }
                else {
                    loginService.login($scope.email, $scope.pass, function (err, user) {
                        if (err)
                            errorHandler(err);

                        else
                            cb && cb(user);
                    });
                }
            };

            $scope.createAccount = function () {
                if (assertValidLoginAttempt()) {
                    loginService.createAccount($scope.email, $scope.pass, function (err, user) {
                        if (err) {
                            errorHandler(err);
                        }

                        else {
                            // must be logged in before I can write to my profile
                            $scope.login(function () {
                                loginService.createProfile(user.uid, user.email, $scope.name);
                                $location.path('/pools');
                            });
                        }
                    });
                }
            };

            function assertValidLoginAttempt() {
                if (!$scope.email) {
                    $alert.$danger('Please enter an email address');
                }
                else if (!$scope.pass) {
                    $alert.$danger('Please enter a password');
                }
                else if ($scope.pass !== $scope.confirm) {
                    $alert.$danger('Passwords do not match');
                }
                else if (!$scope.name) {
                    $alert.$danger('Please enter your name');
                }
                return !$scope.err;
            }

            function errorHandler(error) {
                switch (error.code) {
                    case 'EMAIL_TAKEN':
                        $alert.$danger('Specified email address is already in use');
                        break;
                    case 'INVALID_USER':
                    case 'INVALID_PASSWORD':
                        $alert.$danger('Wrong email and password combination');
                        break;
                    case 'INVALID_EMAIL':
                        $alert.$danger('Invalid email address');
                        break;
                    case 'PASSWORD_MISMATCH':
                        $alert.$danger('Passwords do not match');
                        break;
                    default:
                }
            }
        }])

    .controller('MainCtrl', ['$scope', '$location', 'loginService',
        function ($scope, $location, loginService) {

            $scope.navClass = function (page) {
                var currentRoute = $location.path();
                return page === currentRoute ? 'active' : '';
            };

            $scope.logout = function () {
                loginService.logout();
            };

            $scope.viewTerms = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/terms.html',
                    controller: ModalViewCtrl,
                    resolve: {
                        items: function () {
                            return null;
                        }
                    }
                });
            };
        }])

    .controller('PoolCtrl', ['$scope', '$location', 'syncData', '$firebase', 'firebaseRef', '$modal',
        function ($scope, $location, syncData, $firebase, firebaseRef, $modal) {

            $scope.userPools = syncData('users/' + $scope.auth.user.uid + '/pools/');
            $scope.pools = syncData('pools');

            $scope.add = function () {
                console.log('adding a pool');

                var newPool = { name: '' };

                var modalInstance = $modal.open({
                    templateUrl: 'partials/pools.create.html',
                    controller: ModalCreateCtrl,
                    resolve: {
                        items: function () {
                            return newPool;
                        }
                    }});

                modalInstance.result.then(function (pool) {
                    pool.managers = { };
                    pool.managers[$scope.auth.user.uid] = true;
                    pool.users = { };
                    pool.users[$scope.auth.user.uid] = true;

                    $scope.pools.$add(pool).then(function (newPoolRef) {
                        firebaseRef('/users/' + $scope.auth.user.uid + '/pools/' + newPoolRef.name()).set(true);
                        console.log('pool added');
                        $location.path('/pools/' + newPoolRef.name());
                    });
                });
            };
        }])

    .controller('PoolDetailCtrl', ['$scope', '$routeParams', 'syncData', '$modal', '$alert',
        function ($scope, $routeParams, syncData, $modal, $alert) {
            var picksLoaded = false, bowlsLoaded = false, localPicks;

            var settings = syncData('settings');

            settings.$on("loaded", function () {
                setCurrentSeason(settings.currentSeason);
            });

            $scope.pool = syncData('/pools/' + $routeParams.id);

            $scope.pool.$on("loaded", function () {
                if ($scope.pool.managers[$scope.auth.user.uid])
                    $scope.isManager = true;
            });

            $scope.bowls = syncData('/seasons/' + settings.currentSeason + '/bowls');

            $scope.bowls.$on("loaded", function (bowls) {
                localPicks = syncData('picks/' + $scope.auth.user.uid + '/' + $routeParams.id);

                localPicks.$on("loaded", function () {
                    if (localPicks.$value === null) {
                        var numBowls = $scope.bowls.$getIndex().length;

                        for (var i = 0; i < numBowls; i++) {
                            localPicks.$child(i).$set({ "winner": "", "points": "0" });
                        }
                    }
                });

                localPicks.$bind($scope, "picks").then(function(unbind) {

                });
            });

            $scope.teams = syncData('/teams');

            $scope.poolUsers = syncData('/pools/' + $routeParams.id + '/users');

            $scope.users = syncData('/users');

            $scope.edit = function (pool) {
                var selectedPool = syncData('pools/' + pool.$id);

                var modalInstance = $modal.open({
                    templateUrl: 'partials/pools.edit.html',
                    controller: 'ModalEditorCtrl',
                    resolve: {
                        items: function () {
                            return selectedPool;
                        }
                    }});

                modalInstance.result.then(function (result) {
                    selectedPool.$save().then(function () {
                            $alert.$success('Saved pool!')
                        },
                        function () {
                            $alert.$danger('Failed to save pool!');
                        });
                });
            };

            $scope.invite = function () {
                console.log('saving invite');
                var invitation = syncData('/invitations/' + $scope.user.$id + '/' + $scope.pool.$id);

                invitation["date"] = new Date();
                invitation["sentBy"] = $scope.auth.user.uid;

                invitation.$save();
                console.log('invite saved');

                $scope.poolUsers[$scope.user.$id] = true;
                $scope.poolUsers.$save();
                console.log('pool users saved');
            };

            $scope.setCurrentUser = function ($item, $model, $label) {
                $scope.user = $item;
            };

            var setCurrentSeason = function (season) {
                $scope.bowls = syncData('seasons/' + season + '/bowls/');

                $scope.bowls.$on("loaded", function () {
                    $scope.currentSeason = season;
                });
            };
        }])

    .controller('PreferencesCtrl', ['$scope', 'syncData',
        function ($scope, syncData) {

        }])

    .controller('ProfileCtrl', ['$scope', '$location', 'syncData', '$alert',
        function ($scope, $location, syncData, $alert) {
            $scope.$on("$destroy", function (event, val) {
                $alert.$clear();
            });

            $scope.oldpass = null;
            $scope.newpass = null;
            $scope.confirm = null;

            $scope.user = syncData(['users', $scope.auth.user.uid]);

            $scope.save = function () {
                $scope.user.$priority = $scope.user.email;
                $scope.user.$save()
                    .then(function () {
                        console.log('profile saved');
                        $alert.$success('Saved!');
                    },
                    function (error) {
                        $alert.$danger('Failed to save profile: ' + error.message);
                    });
            };

            $scope.reset = function () {
                $scope.err = null;
                $scope.msg = null;
            };

            $scope.updatePassword = function () {
                $scope.reset();
                loginService.changePassword(buildPwdParms());
            };

            function buildPwdParms() {
                return {
                    email: $scope.auth.user.email,
                    oldpass: $scope.oldpass,
                    newpass: $scope.newpass,
                    confirm: $scope.confirm,
                    callback: function (err) {
                        if (err) {
                            $scope.err = err;
                        }
                        else {
                            $scope.oldpass = null;
                            $scope.newpass = null;
                            $scope.confirm = null;
                            $scope.msg = 'Password updated!';
                        }
                    }
                }
            }
        }])

    .controller('SettingsCtrl', ['$scope', 'syncData', '$alert',
        function ($scope, syncData, $alert) {
            console.log('getting seasons');
            $scope.seasons = syncData('seasons');

            console.log('getting settings');
            $scope.settings = syncData('settings');

            $scope.save = function () {
                $scope.settings.$save().then(
                    function () {
                        $alert.$success('Settings saved!');
                    },

                    function (error) {
                        $alert.$danger('An error occurred while saving settings: ' + error.message);
                    }
                )
            };
        }])

    .controller('SetupCtrl', ['$scope', 'syncData',
        function ($scope, syncData) {

        }])

    .controller('TeamCtrl', ['$scope', 'syncData', '$modal',
        function ($scope, syncData, $modal) {

            console.log('listing teams');
            $scope.teams = syncData(['teams']);
            console.log('team list received');

            $scope.view = function (team) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/teams.view.html',
                    controller: ModalViewCtrl,
                    resolve: {
                        items: function () {
                            return team;
                        }
                    }
                });
            };
        }])

    .controller('UserCtrl', ['$scope', 'syncData', '$modal',
        function ($scope, syncData, $modal) {
            console.log('listing users');
            $scope.users = syncData('users');
            console.log('user list received');

            $scope.view = function (user) {
                var modalInstance = $modal.open({
                    templateUrl: 'partials/users.edit.html',
                    controller: ModalViewCtrl,
                    resolve: {
                        items: function () {
                            return user;
                        }
                    }
                });
            };
        }]);

var ModalCreateCtrl = function ($scope, $modalInstance, items, $alert) {
    $scope.item = items;

    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var ModalViewCtrl = function ($scope, $modalInstance, items) {
    if (items)
        $scope.item = items;

    $scope.ok = function () {
        $modalInstance.dismiss('ok');
    };
};

var ModalEditorCtrl = function ($scope, $modalInstance, items) {
    $scope.item = items;

    $scope.ok = function () {
        $modalInstance.close($scope.item);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
