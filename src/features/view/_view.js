angular.module('view', [])
    .controller('viewController', function($scope, Stream, $stateParams) {
        $scope.paragraphs = [];
        Stream.get($stateParams.id).$bindTo($scope, 'stream').then(function(){
            var text = $scope.stream.written;
            var spaces = text?text.split(' '):[], lines = [];
            for (var i=0;i<spaces.length;i++) {
                lines = lines.concat(spaces[i].split('\n'));
            }
            $scope.paragraphs = $scope.stream.written.split('\n');
            $scope.words = lines.length==1&&lines[0]===''?0:lines.length;
        });
    });