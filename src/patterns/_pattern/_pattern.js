angular.module('<%= name%>', [])
    .directive('go<%= bigname%>', function(){
        return {
        restrict: 'E',
        scope: {

        },
        controller: '<%= name%>Controller as <%= name%>Ctrl',
        templateUrl: 'patterns/<%= name%>/_<%= name%>.html'
    };
})

    .controller('<%= name%>Controller', function($scope, $element) {
      
    });