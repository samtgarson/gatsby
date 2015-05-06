angular.module('app', [
    // App
    'ui.router',
    'templates',
    'breakpointApp',
    'ct.ui.router.extras',
    'ngAnimate',
    'ngSanitize',
    'states',
//    'facebook',
    'services',
    'firebase',

    // Features
    'home',
    'stream',
    'login'
    
    // Patterns
])

    .config(function() {

    })

    .controller('appController', function ($scope, Auth, $state) {
        $scope.title = "Joyce";
        Auth.$onAuth(function(authData) {
            $scope.name = authData?authData.twitter.displayName:false;
        });

        $scope.$on('$stateChangeSuccess', function(e, toState) {
            $scope.title = toState.title?toState.title:'Joyce';
        });

        $scope.logout = function () {
            Auth.$unauth();
            $state.go('login');
        }
        
        
    });

