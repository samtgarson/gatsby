angular.module('home', [])
    .controller('homeController', function($scope, User) {
        User.$bindTo($scope, 'user');
        
    });