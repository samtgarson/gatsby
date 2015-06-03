angular.module('services', [])
    .value('Endpoint', 'https://gatsbyio.firebaseio.com')
    .factory("Auth", function($firebaseAuth, Endpoint) {
        var ref = new Firebase(Endpoint);
        return $firebaseAuth(ref);
    })
    .factory("User", function($firebaseObject, Endpoint, Auth) {
        var ref = new Firebase(Endpoint + "/users/" + Auth.$getAuth().uid);
        return $firebaseObject(ref);
    })

    .service('Stream', function($firebaseObject, Endpoint, User, $q) {
        var service = {};

        service.new  = function () {
            var deferred = $q.defer(),
                streamsRef = new Firebase(Endpoint + '/streams'),
                streamRef = streamsRef.push(),
                date = new Date().getTime();

            if (!User.streams) User.streams = {};
            User.streams[streamRef.key()] = false;
            User.$save();
            
            streamRef.set({
                'owner': User.$id,
                'frozen': false,
                'created': date,
                'written': '',
                'writing': '',
                'tags': []
            });

            // userRef.push[streamRef.key()] = true;
            return streamRef.key();
        };

        service.get = function(uid) {
            ref = new Firebase(Endpoint + '/streams/' + uid);
            return $firebaseObject(ref);
        };

        service.getLatest = function() {
            var deferred = $q.defer();
            User.$loaded().then(function() {
                if (User.latest) deferred.resolve(service.get(User.latest));
                else {
                    var id = service.new();
                    User.latest = id;
                    $q.all([User.$save(), service.get(id)]).then(function(proms) {
                        deferred.resolve(proms[1]);
                    });
                }
            });
            return deferred.promise;
        };

        service.abandon = function (streamObj) {
            if (User.streams) delete User.streams[User.latest];
            delete User.latest;
            return $q.all([streamObj.$remove(), User.$save()]);
        };

        return service;
    })
    .factory('Alchemy', function($resource){
        return function(text) {
            return $resource(
                "https://access.alchemyapi.com/calls/text/TextGetRankedTaxonomy",
                {
                    "apikey": "e60e2344a23b3ebfe425e5792d8e203b906e235d",
                    "text": text,
                    "outputMode": 'json'

                });
        };
    });