'use strict';
/* http://docs.angularjs.org/#!angular.service */

// Declare app level module which depends on filters, and services
var Cellar=angular.module('cellar', [ 'cellar.services', 'cellar.directives',
                                     'http-auth-interceptor','SharedServices',
                                      ,'time','Notification' ]).config(
		[ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/wines', {
				templateUrl : 'partials/wine-thumbs.xml',
				controller: WineListCtrl	
			})
			// any route that doesn't match an available wine will result in an
			// empty form, which can be used to add a new wine
			.when('/wines/:wineId', {
				templateUrl : 'partials/wine-details.xml',
				controller : WineDetailCtrl
			}).when('/list', {
				templateUrl : 'partials/wine-list.xml',
				controller : WineListCtrl
			}).when('/users', {
				templateUrl : 'partials/users.xml',controller: UserCtrl
			}).when('/welcome', {
				templateUrl : 'partials/welcome.xml'			
			}).when('/resources', {
				templateUrl : 'partials/resources.xml'	
            }).when('/auth/login', {
				templateUrl : 'auth/login.xml'
            }).when('/auth/register', {
				templateUrl : 'auth/register.xml'
            }).when('/auth/changepassword', {
				templateUrl : 'auth/changepassword.xml'
            }).when('/auth/lostpassword', {
				templateUrl : 'auth/lostpassword.xml'					
			}).otherwise({
				redirectTo : '/wines'
			});
		}]);
// picture filter, use generic if not set		
Cellar.filter('default', function() {
	return function(pic) {return pic ? pic : 'generic.jpg';}
});		
/* no hashbang within URLs for browers that support HTML5 history
Cellar.config(['$locationProvider', function($location) {
  $location.html5Mode(true); 
}]);
*/		
// http://www.bennadel.com/blog/2424-Setting-Prototype-Properties-Using-Inherited-Scope-Methods-In-AngularJS.htm
// Define our root-level controller for the application.
Cellar.controller("AppController", function($scope,$location, $window,flash) {

     // http://stackoverflow.com/questions/10713708/tracking-google-analytics-page-views-with-angular-js
	  $scope.$on('$viewContentLoaded', function(event) {
		$window._gaq.push(['_trackPageview', $location.path()]);
	  });
	  // auth stuff
	  $scope.$on('event:auth-loginRequired', function() {
		  $location.path("/auth/login");
        });
       $scope.$on('event:auth-loginConfirmed', function() {
          alert("logedin")
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
		$scope.windowTitle = title+ " " + appname;

	};
	  $scope.msgInput = "The Tomatoes Exploded!";
	  $scope.flash = flash;
});


// http://plnkr.co/edit/3n8m1X?p=preview
Cellar.factory("flash", function($rootScope) {
	  var queue = [], currentMessage = '';
	  
	  $rootScope.$on('$routeChangeSuccess', function() {
	    console.log("routeChangeSuccess: ",queue.length)
	    if (queue.length > 0) 
	      currentMessage = queue.shift();
	    else
	      currentMessage = '';
	  });
	  
	  return {
	    set: function(message) {
		 // console.log("flash set")
	      queue.push(message);
	    },
	    get: function(message) {
		//console.log("flash get")
	      return currentMessage;
	    }
	  };
	});

// https://github.com/jhulick/the-issues-angularjs-demo
Cellar.factory('Auth', function() {
	  Auth = {
	    username: localStorage.username,
	    login: function(username) {
	      localStorage.username = username
	      this.username = username
	      this.loggedIn = true
	    },
	    logout: function() {
	      localStorage.removeItem('username')
	      delete this.username
	      this.loggedIn = false
	    }
	  }
	  Auth.loggedIn = !!Auth.username
	  return Auth
	})