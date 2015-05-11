angular.module('login', [])
    .controller('loginController', function($scope, $state, Auth, currentAuth, Endpoint, $firebaseObject) {
        if (currentAuth) $state.go('home');
        
        $scope.login = function() {
            $scope.authData = null;
            $scope.error = null;

            Auth.$authWithOAuthPopup('twitter').then(function(authData) {
                var ref = new Firebase(Endpoint + '/users/' + authData.uid),
                    user = $firebaseObject(ref);
                if (!user.$value) {
                    user.name = authData.twitter.displayName;
                    user.handle= authData.twitter.username;
                    user.avatar = authData.twitter.cachedUserProfile.profile_image_url.replace(/_[^./]*\./, '_bigger.');
                    user.latest = false;
                    user.$save().then(function() {
                        $state.go('home');    
                    });
                } else {
                    $state.go('home');
                }
            });
        };  
    });