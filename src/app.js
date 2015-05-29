angular.module('app', [
    // App
    'ui.router',
    'templates',
    'breakpointApp',
    'ct.ui.router.extras',
    'ngAnimate',
    'ngResource',
    'ngSanitize',
    'states',
    'anim-in-out',
    'services',
    'firebase',
    'angularMoment',

    // Features
    'home',
    'write',
    'login',
    'title'
    
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
    .controller('appController', function ($scope, Auth, $state) {
        $scope.title = "Joyce";
        Auth.$onAuth(function(authData) {
            if (authData) {
                $scope.name = authData.twitter.displayName;
                $scope.avatar = authData.twitter.cachedUserProfile.profile_image_url.replace(/_[^./]*\./, '_bigger.');
            } else {
                $scope.name = false;
                $scope.avatar = false;
            }
        });

        $scope.$on('$stateChangeSuccess', function(e, toState) {
            $scope.title = toState.title?toState.title:'Joyce';
        });
        
        
    });

