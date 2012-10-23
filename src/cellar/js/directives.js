/*
* Directive that adds a class to a link if the href value of the link matches
* the location.path()
*/

//Syntax allows to chain factories
angular.module('cellar.directives', [])
	.directive('activeLink', ['$location', function(location) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs, controller) {
	            var clazz = attrs.activeLink;
	            var elementPath;
	            //Observe the href value because it is interpolated
	            attrs.$observe('href', function(value) {
					elementPath = value.substring(1);
	            });

            	scope.location = location;
	            scope.$watch('location.path()', function(newPath) {
	                if (elementPath === newPath) {
	                    element.addClass(clazz);
	                } else {
	                    element.removeClass(clazz);
	                }
	            });	

	        }
		};
	}]);

