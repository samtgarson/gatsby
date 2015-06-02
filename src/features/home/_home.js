angular.module('home', [])
    .controller('homeController', function($scope, User) {
        User.$bindTo($scope, 'user');
        
    })
    .filter('objectFilter', function() {
        return function(list) {
            if (!list) return 0;
            var keys = Object.keys(list), count=0;
            for (var i=0;i<keys.length;i++) {
                if (list[keys[i]]) count++;
            }
            return count;
        };
    });