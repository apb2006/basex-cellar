'use strict';
/* http://docs.angularjs.org/#!angular.service */

// Declare app level module which depends on filters, and services
var Cellar=angular.module('cellar', [ 'cellar.services', 'cellar.directives','SharedServices','time' ]).config(
		[ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/wines', {
				templateUrl : 'partials/welcome.html'
			})
			// any route that doesn't match an available wine will result in an
			// empty form, which can be used to add a new wine
			.when('/wines/:wineId', {
				templateUrl : 'partials/wine-details.html',
				controller : WineDetailCtrl
			}).when('/thumbs', {
				templateUrl : 'partials/wine-thumbs.html'
			}).otherwise({
				redirectTo : '/wines'
			});
		}]);
/* no hashbang within URLs for browers that support HTML5 history
Cellar.config(['$locationProvider', function($location) {
  $location.html5Mode(true); 
}]);
*/		
// http://www.bennadel.com/blog/2424-Setting-Prototype-Properties-Using-Inherited-Scope-Methods-In-AngularJS.htm
// Define our root-level controller for the application.
Cellar.controller("AppController", function($scope,flash) {

	// Set up the default programmtic window title. Once
	// the app runs, this will overwrite the value that
	// is currently set in the HTML.
	$scope.windowTitle = "Angular RESTXQ Cellar";

	// This App Controller is the only controller that
	// has access to the Title element. As such, we need
	// to provide a way for deeply nested Controllers to
	// update the window title according to the page
	// state.
	$scope.setWindowTitle = function(title) {
		// This function closure has lexical access to
		// the $scope instance associated with this App
		// Controller. That means that when this method
		// is invoked on a "sub-classed" $scope instance,
		// it will affect this scope higher up in the
		// prototype chain.
		$scope.windowTitle = title;

	};
	  $scope.msgInput = "The Tomatoes Exploded!";
	  $scope.flash = flash;
});


// http://plnkr.co/edit/3n8m1X?p=preview
Cellar.factory("flash", function($rootScope) {
	  var queue = [], currentMessage = '';
	  
	  $rootScope.$on('$routeChangeSuccess', function() {
	    if (queue.length > 0) 
	      currentMessage = queue.shift();
	    else
	      currentMessage = '';
	  });
	  
	  return {
	    set: function(message) {
	      queue.push(message);
	    },
	    get: function(message) {
	      return currentMessage;
	    }
	  };
	});
