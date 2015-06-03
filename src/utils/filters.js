angular.module('filters', [])
    .filter('avatarSizer', function() {
        return function(s) {
            return s.replace(/_(normal|bigger|mini)/, '');
        };
    })
    .filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    })
    .filter('objectFilter', function() {
        return function(list) {
            if (!list) return 0;
            var keys = Object.keys(list), count=0;
            for (var i=0;i<keys.length;i++) {
                if (list[keys[i]].completed) count++;
            }
            return count;
        };
    });