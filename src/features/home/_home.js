angular.module('home', [])
    .controller('homeController', function($scope) {
          $scope.overflowModel = '';
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

                        for (var i=len;i>=0;i--){
                            if (text[i] == ' ') {
                                break;
                            }
                        }
                        if (i) {
                            var over = text.substr(0, i+1),
                                remainder = text.substr(i+1);
                            scope.overflow += over;
                            element.val(remainder);
                        }
                    }
                });
            }
        };
    });
    
