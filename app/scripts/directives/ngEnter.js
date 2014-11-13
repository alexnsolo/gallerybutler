'use strict';

angular.module('gallerybutler').directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind('keyup', function(event) {
            if(event.which === 13) {
                scope.$eval(attrs.ngEnter);
                event.preventDefault();
            }
        });
    };
});