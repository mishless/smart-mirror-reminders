angular.module('myApp').controller('loginController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {
        $scope.login = function() {
            $scope.error = false;
            $scope.disabled = true;
            AuthService.login($scope.loginForm.username, $scope.loginForm.password).then(function() {
                $location.path('/home');
                $scope.disabled = false;
                $scope.loginForm = {};
            }).catch(function() {
                $scope.error = true;
                $scope.errorMessage = "Invalid username and/or password.";
                $scope.disabled = false;
                $scope.loginForm = {};
            });
        };
        $scope.navigateTo = function(path) {
            $location.path(path);
        };
    }
]);

angular.module('myApp').controller('logoutController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {
        $scope.logout = function() {
            // call logout from service
            AuthService.logout()
                .then(function() {
                    $location.path('/login');
                });
        };
    }
]);

angular.module('myApp').controller('registerController', ['$scope', '$location', 'AuthService',
    function($scope, $location, AuthService) {
        $scope.register = function() {
            // initial values
            $scope.error = false;
            $scope.disabled = true;
            // call register from service
            AuthService.register($scope.registerForm)
                // handle success
                .then(function() {
                    $location.path('/login');
                    $scope.disabled = false;
                    $scope.registerForm = {};
                })
                // handle error
                .catch(function() {
                    $scope.error = true;
                    $scope.errorMessage = "Something went wrong!";
                    $scope.disabled = false;
                    $scope.registerForm = {};
                });

        };

    }
]);

angular.module('myApp').controller('mainController', ['$scope', '$location', '$filter', '$http', 'ReminderService', 'AuthService',
    function($scope, $location, $filter, $http, ReminderService, AuthService) {
        $scope.error = false;

        $scope.reminders = [];
        ReminderService.getReminders().then(function(data) {
            $scope.reminders = data.reminders;

        }).catch(function(data) {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
        });
        $scope.recurrences = [{
            value: 'n',
            text: 'Non-recurrent'
        }, {
            value: 'd',
            text: 'Daily'
        }, {
            value: 'w',
            text: 'Weekly'
        }, {
            value: 'm',
            text: 'Monthly'
        }];
        $scope.days = [{
            value: 1,
            text: 'Monday'
        }, {
            value: 2,
            text: 'Tuesday'
        }, {
            value: 3,
            text: 'Wednesday'
        }, {
            value: 4,
            text: 'Thursday'
        }, {
            value: 5,
            text: 'Friday'
        }, {
            value: 6,
            text: 'Saturday'
        }, {
            value: 7,
            text: 'Sunday'
        }];
        $scope.dates = [];
        for (var i = 1; i <= 28; i++) {
            $scope.dates.push({
                value: i,
                text: i.toString()
            });
        }

        $scope.showRecurrence = function(reminder) {
            var selected = [];
            if (reminder.recurrence) {
                selected = $filter('filter')($scope.recurrences, {
                    value: reminder.recurrence
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.showDay = function(reminder) {
            var selected = [];
            if (reminder.day) {
                selected = $filter('filter')($scope.days, {
                    value: reminder.day
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.showDate = function(reminder) {
            var selected = [];
            if (reminder.date) {
                selected = $filter('filter')($scope.dates, {
                    value: reminder.date
                });
            }
            return selected.length ? selected[0].text : 'Not set';
        };

        $scope.saveReminder = function(data, userId, id) {
            if (id) {
                angular.extend(data, {
                    id: id,
                    userId: userId
                });
                return $http.post('/reminder/' + id, data);
            } else {
                angular.extend(data, {
                    userId: userId
                });
                return $http.put('/reminder/', data);
            }
        };

        // remove user
        $scope.removeReminder = function(index, id) {
            $scope.reminders.splice(index, 1);
            return $http.delete('/reminder/' + id);
        };

        // add user
        $scope.addReminder = function() {
            $scope.inserted = {
                userId: $scope.user.id,
                title: '',
                recurrence: null,
                day: null,
                date: null,
                description: ''
            };
            $scope.reminders.push($scope.inserted);
        };
        $scope.changeRecurrence = function(data, form) {
            angular.forEach(form.$editables, function(editable) {
                if (editable.name === 'recurrence') {
                    editable.scope.$data = data;
                    editable.save();
                }
            });
        };
        AuthService.getUser().success(function(data) {
            $scope.user = data.user;

        }).error(function(data) {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
        });
    }
]);
