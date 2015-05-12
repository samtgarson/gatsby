angular.module('write', [])
    .controller('writeController', function($scope, Stream, $state) {
        $scope.words = 0;
        $scope.stream = false;
        var streamRef;

        Stream.getLatest().then(function(streamObj) {
            streamRef = streamObj;
            streamObj.$bindTo($scope, 'stream').then(function() {
                $scope.updateWords();
                $scope.created = new Date(parseInt(streamObj.created));
            });
        });

        $scope.preventPaste = function (e) {
            e.preventDefault();
            return false;
        };

        $scope.updateWords = function (e) {
            var text = $scope.stream.writing + $scope.stream.written;
            var spaces = text.split(' '), lines = [];
            for (var i=0;i<spaces.length;i++) {
                lines = lines.concat(spaces[i].split('\n'));
            }
            $scope.words = lines.length==1&&lines[0]===''?0:lines.length;
        };

        $scope.abandon = function () {
            if (!$scope.abandon_confirm) $scope.abandon_confirm = true;
            else Stream.abandon(streamRef).then(function (){
                $state.go('home');
            });
        };

        $scope.complete = function () {
            if (!$scope.complete_confirm) $scope.complete_confirm = true;
            else {
                Stream.complete(streamRef).then(function (){
                    $state.go('home');
                });
            }
        };



    })
    .directive('overflow',function($timeout) {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            scope: {
                overflow: '=',
                previousLine: '='
            },
            link: function(scope, element, attrs) {
                var origHeight = element[0].scrollHeight, 
                    lineheight = parseInt($(element[0]).css('line-height'));
                element.on('blur keyup change', function() {
                    var text = element.val(),
                        scrollHeight = element[0].scrollHeight;


                    if (scrollHeight > origHeight) {
                        var lines = scrollHeight / lineheight,
                            len = Math.round(text.length / 3),
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
                        previousLine = over;
                        element.val(remainder);
                    }
                });
            }
        };
    });
    
