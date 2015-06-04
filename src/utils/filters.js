angular.module('filters', [])
    .filter('avatarSizer', function() {
        return function(s) {
            return s.replace(/_(normal|bigger|mini)/, '');
        };
    })
    .filter('notBlank', function() {
        return function(a) {
            return a.filter(function(s) {
                return !!s.length;
            });
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
    })
    .directive('comments', function() {
        return {
            restrict: 'E', // only activate on element attribute
            scope: {
                stream: '=',
            },
            controller: function($scope) {
                var prevRange = null, sel, id = null;
                $(document).on('mouseup', function(e) {
                    sel = window.getSelection();
                    if (!sel.isCollapsed && checkEl(sel)) {
                        clearSelection();
                        // var box = sel.getRangeAt(0).getBoundingClientRect();
                        prevRange = sel.getRangeAt(0);
                        id = parseInt(e.target.id);
                        $(sel.focusNode.parentElement).addClass('add-comment');
                    } else if (e.target.localName == 'input') {
                        wrapContents(prevRange);
                        $('.content-wrapper').addClass('fade');
                        e.preventDefault();
                        return false;
                    } else {
                        clearSelection();
                    }
                })
                .on('mousedown', function(e) {
                    clearSelection(true);
                });

                $('p.content input').on('keypress', function(e) {
                    if (e.which == 13) {
                        console.log('enter!');
                    }
                });

                $scope.$on('$destroy', function() {
                    $(document).off('mouseup mousedown');
                    $('input').off('keypress');
                });



                function clearSelection(skipInput) {
                    if (!skipInput) {
                        id = null;
                        $('.add-comment').removeClass('add-comment');
                        prevRange = null;
                        $('.content-wrapper').removeClass('fade');
                        $('p.content input').val('');
                    }
                    $('p.content span').replaceWith(function() {
                        return $(this).text();
                    });
                }

                function wrapContents(r) {
                    var n = document.createElement("span");
                    r.surroundContents(n);
                }

                function checkEl(sel) {
                    var a = sel.anchorNode.parentElement,
                        f = sel.focusNode.parentElement;
                    return (a==f) && ($(a).hasClass('content'));
                }
            }
        };
    });