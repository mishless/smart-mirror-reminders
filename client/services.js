angular.module('myApp').factory('AuthService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {
        var user = null;
        var isLoggedIn = function() {
            if (user) {
                return true;
            } else {
                return false;
            }
        };
        var getUser = function() {
            return $http.get('/user/status')
                // handle success
                .success(function(data, status) {
                    if (data.status) {
                        user = data.user;
                    } else {
                        user = null;
                    }
                })
                // handle error
                .error(function(data) {
                    user = null;
                });
        };
        var login = function(username, password) {
            var deferred = $q.defer();
            $http.post('/user/login', {
                username: username,
                password: password
            }).success(function(data, status) {
                if (status === 200 && data.status) {
                    user = data.user;
                    deferred.resolve();
                } else {
                    user = false;
                    deferred.reject();
                }
            }).error(function(data) {
                user = false;
                deferred.reject();
            });
            return deferred.promise;
        };
        var logout = function() {
            var deferred = $q.defer();
            $http.get('/user/logout').success(function(data) {
                user = false;
                deferred.resolve();
            }).error(function(data) {
                user = false;
                deferred.resolve();
            });
            return deferred.promise;
        };

        var register = function(userData) {
            var deferred = $q.defer();

            $http.post('/user/register', {
                    username: userData.username,
                    password: userData.password,
                    fullName: userData.fullName,
                    gender: userData.gender,
                    year: userData.year,
                    email: userData.email,
                    height: userData.height,
                    weight: userData.weight
                })
                // handle success
                .success(function(data, status) {
                    if (status === 200 && data.status) {
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                })
                // handle error
                .error(function(data) {
                    deferred.reject();
                });
            return deferred.promise;
        }
        return ({
            isLoggedIn: isLoggedIn,
            getUser: getUser,
            login: login,
            logout: logout,
            register: register
        });
    }
]);

angular.module('myApp').factory('ReminderService', ['$q', '$timeout', '$http', 'AuthService', function($q, $timeout, $http, AuthService) {
    var reminders = [];
    var getReminders = function(id) {
        var deferred = $q.defer();
        AuthService.getUser()
            .then(function(data) {
                if (data.data.status && data.data.user && AuthService.isLoggedIn()) {
                    $http.get('/reminder/' + data.data.user.id)
                        // handle success
                        .success(function(data, status) {
                            if (status === 200 && data.authenticated) {
                                deferred.resolve(data);
                            } else {
                                deferred.reject();
                            }
                        })
                        // handle error
                        .error(function(data) {
                            deferred.reject();
                        });
                }
            }).catch(function(data) {
                deferred.reject();
            });
        return deferred.promise;
    };
    return {
        getReminders: getReminders
    };
}]);
