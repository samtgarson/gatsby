angular.module('title', [])
    .controller('titleController', function($scope, $state, $stateParams, $q, User, Stream, Alchemy) {
        if (!User.latest) {
            $state.go('write');
        } else {
            var stream = Stream.get(User.latest);

            Alchemy($stateParams.text).get().$promise.then(function(response) {
                stream.tags = [];
                response.taxonomy.filter(function(current) {
                    return !current.confident || current.confident != 'no';
                }).forEach(function(current) {
                    stream.tags.push(current.label.split('/')[1]);
                });
            });
            $scope.title = '';
        }

        $scope.save = function() {
            if (!$scope.title) $scope.title = 'untitled';
            $scope.saving = true;
            var completed = new Date().getTime();
            delete User.latest;
            User.streams[stream.$id] = {
                'completed': completed,
                'title': $scope.title
            };
            var userProm = User.$save();

            stream.written = stream.written + stream.writing;
            delete stream.writing;
            stream.frozen = true;
            stream.title = $scope.title;
            stream.completed = completed;

            var streamProm = stream.$save();

            $q.all([userProm, streamProm]).then(function() {
                $state.go('home');
            });
        };
    });