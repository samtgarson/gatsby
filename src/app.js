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
    'write',
    'login'
    
    // Patterns
])
    .controller('appController', function ($scope, Auth, User, $state) {
        $scope.title = "Joyce";
        if (User.$loaded) {
            User.$loaded(function (user) {
                $scope.name = user.name?user.name:false;
                $scope.avatar = user.avatar?user.avatar:false;
            });
        }

        $scope.$on('$stateChangeSuccess', function(e, toState) {
            $scope.title = toState.title?toState.title:'Joyce';
        });

        $scope.logout = function () {
            Auth.$unauth();
            $state.go('login');
        };
        
        
    });

