angular.module('app', [
    // Vendor
    'ui.router',
    'breakpointApp',
    'ct.ui.router.extras',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'anim-in-out',
    'firebase',
    'angularMoment',

    // App
    'templates',
    'states',
    'services',
    'filters',

    // Features
    'home',
    'write',
    'login',
    'title',
    'view'
    
    // Patterns
])
    .run(function() {
        moment.locale('en', {
            calendar : {
                lastDay : '[Yesterday at] h:mma',
                sameDay : '[Today at] h:mma',
                nextDay : '[Tomorrow at] h:mma',
                lastWeek : '[last] dddd [at] h:mma',
                nextWeek : 'dddd [at] h:mma',
                sameElse : 'll [at] h:mma'
            }
        });
    })
    .controller('appController', function ($scope, Auth, $state, Endpoint, $firebaseArray, $filter) {
        $scope.title = "Gatsby";
        Auth.$onAuth(function(authData) {
            if (authData) {
                $scope.name = authData.twitter.displayName;
                $scope.avatar = authData.twitter.cachedUserProfile.profile_image_url.replace(/_[^./]*\./, '_bigger.');
                $firebaseArray(new Firebase(Endpoint + '/users/' + authData.uid + '/streams')).$loaded(function(streams) {
                    $scope.streams = streams;
                });
            } else {
                $scope.name = false;
                $scope.avatar = false;
            }
        });

        $scope.$on('$stateChangeSuccess', function(e, toState) {
            $scope.title = toState.name?$filter('titlecase')(toState.name) + ' | Gatsby':'Gatsby';
        });
    });

