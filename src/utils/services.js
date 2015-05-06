angular.module('services', [])
    .value('Endpoint', 'https://joyce.firebaseio.com')
    .factory("Auth", function($firebaseAuth) {
            var ref = new Firebase("https://joyce.firebaseio.com");
            return $firebaseAuth(ref);
        }
    )
    .service('Stream', function($firebaseObject, Endpoint, Auth, $q) {
        var service = {};

        service.new  = function () {
            var deferred = $q.defer(),
                streamsRef = new Firebase(Endpoint + '/streams'),
                streamRef = streamsRef.push(),
                user = Auth.$getAuth(),
                date = new Date().getTime(),
                userRef = new Firebase(Endpoint + '/users/' + user.uid + '/streams/' + streamRef.key());

            userRef.set(true);
            streamRef.set({
                'owner': user.uid,
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