angular.module('stream', [])
    .controller('streamController', function($scope, streamObj) {
        $scope.words = 0;

        streamObj.$bindTo($scope, 'stream');

        $scope.updateWords = function (e) {
            var text = $scope.stream.writing + $scope.stream.written,
                spaces = text.split(' '), lines = [];
            for (var i=0;i<spaces.length;i++) {
                lines = lines.concat(spaces[i].split('\n'));
            }
            $scope.words = lines.length;
        };
    })
    .directive('overflow',function($timeout) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            scope: {
                overflow: '='
            },
            link: function(scope, element, attrs) {
                var origHeight = element[0].scrollHeight;
                element.on('blur keyup change', function() {
                    var text = element.val(),
                        scrollHeight = element[0].scrollHeight;

                    if (scrollHeight > origHeight) {
                        var len = Math.round(text.length / 3),
                            third = text.substr(0, len);

                        var newLines = third.split('\n'), over, remainder;

                        if (newLines.length > 1) {
                            over = newLines[0] + '\n';
                            remainder = text.substr(newLines[0].length + 1);
                        } else {
                            for (var i=len;i>=0;i--){
                                if (text[i] == ' ') {
                                    break;
                                }
                            }
                            if (i) {
                                over = text.substr(0, i+1);
                                remainder = text.substr(i+1);
                            }
                        }
                        scope.overflow += over;
                        element.val(remainder);
                    }
                });
            }
        };
    });
    
