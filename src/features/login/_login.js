angular.module('login', [])
    .controller('loginController', function($scope, $state, Auth, currentAuth, Endpoint, $firebaseObject) {
        if (currentAuth) $state.go('home');
        
        $scope.login = function() {
            $scope.authData = null;
            $scope.error = null;

            Auth.$authWithOAuthPopup('twitter').then(function(authData) {
                var ref = new Firebase(Endpoint + '/users/' + authData.uid),
                    user = $firebaseObject(ref);
                user.$loaded(function(data) {
                    if (data.$value === null) {
                        user.name = authData.twitter.displayName;
                        user.handle= authData.twitter.username;
                        user.$save().then(function() {
                            $state.go('home');    
                        });
                    } else {
                        $state.go('home');
                    }
                });
            }).catch(function(error) {
                $scope.error = error;
            });
        };  
    });