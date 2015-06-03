angular.module('states', [])

    // When app is first run;
    // Checks if user is logged in with Cookies
    .run (function($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error == 'AUTH_REQUIRED') {
                $state.go('login');
            }
        });
    })
    .config(function($stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $httpProvider.interceptors.push(function($q, $rootScope, $location) {
            return {
                'request': function(config) {
                    $rootScope.$broadcast('ajaxStart', config);
                    return config;
                },
                'response': function(config) {
                    $rootScope.$broadcast('ajaxEnd', config);
                    return config;
                },
                'responseError': function(config) {
                    $rootScope.$broadcast('ajaxEnd', config);
                    return config;
                }
            };
        });

        $urlRouterProvider
            .otherwise("/"); 
            
        $locationProvider.html5Mode(true);

        // $stickyStateProvider.enableDebug(true);

        // Function to generate template urls
        function templater (page, child) {
            if (angular.isUndefined(child)) child = page;
            return 'features/' + page + '/_' + child + '.html';
        }

        $stateProvider
            .state('login', {
                'url'         : '/login',
                'templateUrl' : templater('login'),
                'controller'  : 'loginController',
                'resolve'     : {
                    "currentAuth" : ["Auth", function(Auth) {
                        return Auth.$waitForAuth();
                    }]
                }
            })
            .state('home', {
                'url'         : '/',
                'templateUrl' : templater('home'),
                'controller'  : 'homeController',
                'resolve'     : {
                    "currentAuth"  : ["Auth", function (Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            })
            .state('write', {
                'url'         : '/write',
                'templateUrl' : templater('write'),
                'controller'  : 'writeController',
                'resolve'     : {
                    "currentAuth"  : ["Auth", function (Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            })
            .state('title', {
                'url'         : '/title',
                'templateUrl' : templater('title'),
                'controller'  : 'titleController',
                'params'      : {'text': null},
                'resolve'     : {
                    "currentAuth"  : ["Auth", function (Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            })
            .state('view', {
                'url'         : '/view/:id',
                'templateUrl' : templater('view'),
                'controller'  : 'viewController',
                'resolve'     : {
                    "currentAuth"  : ["Auth", function (Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            })
            .state('logout', {
                'url'         : '/logout',
                'controller'  : ['Auth', '$state', function(Auth, $state) {
                    Auth.$unauth();
                    $state.go('login');
                }]
            });
    });
