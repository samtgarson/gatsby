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
            .state('write', {
                'url'         : '/',
                'templateUrl' : templater('write'),
                'controller'  : 'writeController',
                'title'       : "New Stream",
                'resolve'     : {
                    "streamObj"  : ["Stream", "User", "$q", "Auth", function (Stream, User, $q, Auth) {
                        var deferred = $q.defer();
                        $q.all({'authData': Auth.$requireAuth(), 'userData': User.$loaded()})
                        .then(function(data) {
                            if (data.userData.latest) deferred.resolve(Stream.get(data.userData.latest));
                            else {
                                Stream.get(Stream.new()).then(function(newStream) {
                                    User.latest = newStream.$id;
                                    User.$save().then(function(){
                                        deferred.resolve(newStream);
                                    });
                                });
                                
                            }
                        }).catch(function(err) {
                            deferred.reject(err);
                        });
                        return deferred.promise;
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
