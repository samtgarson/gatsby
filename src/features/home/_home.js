angular.module('home', [])
    .controller('homeController', function($scope, $state, Stream) {
        $scope.newStream = function () {
            $state.go('stream', {id: Stream.new()});
        };


    });