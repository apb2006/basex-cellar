'use strict';
/* http://docs.angularjs.org/#!angular.service */

// Declare app level module which depends on filters, and services
var Cellar=angular.module('cellar', [ 'cellar.services', 'cellar.directives','Error',
                                     'SharedServices','cellar.auth','flasher']).
config(
		[ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/wines', {
				templateUrl : 'partials/wine-thumbs.xml',
				controller: WineListCtrl	
			})
			.when('/wines/:wineId', {
				templateUrl : 'partials/wine-details.xml',
				controller : WineDetailCtrl
			}).when('/list', {
				templateUrl : 'partials/wine-list.xml',
				controller : WineListCtrl
			}).when('/grapes', {
				templateUrl : 'partials/grape-list.xml',
				controller : GrapeListCtrl	
			}).when('/users', {
				templateUrl : 'partials/user-list.xml',controller: UserCtrl,permission:"*"
			}).when('/users/:userid', {
				templateUrl : 'partials/user-details.xml'
			}).when('/welcome', {
				templateUrl : 'partials/welcome.xml'			
			}).when('/resources', {
				templateUrl : 'partials/resources.xml',permission:"*"
			}).when('/404', {
				templateUrl : 'partials/404.xml'			
            }).otherwise({
				redirectTo : '/wines'
			});
		}]).
		run(function($rootScope, $location, Auth,Flash) {
  return $rootScope.$on('$routeChangeStart', function(event,next, current) {
    if (!Auth.isAuthenticated() && next.$route && next.$route.permission) {
	  Auth.setReturn($location.$$url);
	//  Flash.add("warn","You must log in to access the page");
      return $location.path("/auth/login");
    }
  });
});;
// picture filter, use generic if not set		
Cellar.filter('winePic', function() {
	return function(pic) {return pic ? pic : 'generic.jpg';}
});		
/* no hashbang within URLs for browers that support HTML5 history
Cellar.config(['$locationProvider', function($location) {
  $location.html5Mode(true); 
}]);
*/		
// http://www.bennadel.com/blog/2424-Setting-Prototype-Properties-Using-Inherited-Scope-Methods-In-AngularJS.htm
// Define our root-level controller for the application.
Cellar.controller("AppController", function($scope,$location, $window,Auth,Flash) {
      $scope.auth=Auth;
	  // flash msgs... 
	  $scope.alerts=[]; 
	  $scope.$on('showflash', function(event) {
		$scope.alerts=Flash.msgs();
	  });
     // http://stackoverflow.com/questions/10713708/tracking-google-analytics-page-views-with-angular-js
	  $scope.$on('$viewContentLoaded', function(event) {
		$window._gaq.push(['_trackPageview', $location.path()]);
	  });
	 
	// Set up the default programmtic window title. Once
	// the app runs, this will overwrite the value that
	// is currently set in the HTML.
	var appname="RESTXQ Angular Cellar"
	$scope.windowTitle = appname;

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
		$scope.windowTitle = title+ " - " + appname;

	};
});

