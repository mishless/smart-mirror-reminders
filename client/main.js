var myApp = angular.module('myApp', ['ngRoute', 'xeditable']);

myApp.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/home.html',
            access: {
                restricted: true
            }
        }).when('/login', {
            templateUrl: '/partials/login.html',
            controller: 'loginController',
            access: {
                restricted: false
            }
        }).when('/register', {
            templateUrl: '/partials/register.html',
            controller: 'registerController',
            access: {
                restricted: false
            }
        }).when('/home', {
            templateUrl: '/partials/home.html',
            controller: 'mainController',
            access: {
                restricted: true
            }
        }).otherwise({
            redirectTo: '/',
            access: {
                restricted: false
            }
        });
});

myApp.run(function($rootScope, $location, $route, AuthService, editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
    $rootScope.$on('$routeChangeStart',
        function(event, next, current) {
            AuthService.getUser()
                .then(function(data) {
                    if (next.access && next.access.restricted && !AuthService.isLoggedIn()) {
                        $location.path('/login');
                        $route.reload();
                    }
                });
        });
});
