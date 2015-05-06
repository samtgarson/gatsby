angular.module('states', [])

    // When app is first run;
    // Checks if user is logged in with Cookies
    .run (function($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            if (error == 'AUTH_REQUIRED') {
                $state.go(home);
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
            return 'src/features/' + page + '/_' + child + '.html';
        }

        $stateProvider
            .state('home', {
                'url'         : '/',
                'templateUrl' : templater('home'),
                'controller'  : 'homeController',
                'title'       : "Joyce",
                'resolve'     : {
                    "currentAuth" : ["Auth", function(Auth) {
                        return Auth.$requireAuth();
                    }]
                }
            })
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
            .state('stream', {
                'url'         : '/stream/:id',
                'templateUrl' : templater('stream'),
                'controller'  : 'streamController',
                'title'       : "New Stream",
                'resolve'     : {
                    "currentAuth" : ["Auth", function(Auth) {
                        return Auth.$requireAuth();
                    }],
                    "streamObj"  : ["Stream", "$stateParams", function (Stream, $stateParams) {
                        return Stream.get($stateParams.id);
                    }]
                }
            });
    });
