angular.module('services', [])
    .value('Endpoint', 'https://joyce.firebaseio.com')
    .factory("Auth", function($firebaseAuth) {
            var ref = new Firebase("https://joyce.firebaseio.com");
            return $firebaseAuth(ref);
        }
    )
    .factory('User', function ($firebaseObject, Endpoint, Auth) {
        var authData = Auth.$getAuth();
        if (authData) {
            var ref = new Firebase(Endpoint + '/users/' + authData.uid);
            return $firebaseObject(ref);
        } else return false;
    })
    .service('Stream', function($firebaseObject, Endpoint, User, $q) {
        var service = {};

        service.new  = function () {
            var deferred = $q.defer(),
                streamsRef = new Firebase(Endpoint + '/streams'),
                streamRef = streamsRef.push(),
                date = new Date().getTime();

            User.$loaded().then(function(){
                if (!User.streams) User.streams = {};
                User.streams[streamRef.key()] = true;
                User.$save();
            });
            
            streamRef.set({
                'owner': User.$id,
                'frozen': false,
                'created': date,
                'written': '',
                'writing': ''
            });

            // userRef.push[streamRef.key()] = true;
            return streamRef.key();
        };

        service.get = function(uid) {
            ref = new Firebase(Endpoint + '/streams/' + uid);
            return $firebaseObject(ref).$loaded();
        };

        return service;
    });