'use strict';
/* http://docs.angularjs.org/#!angular.service */

// Declare app level module which depends on filters, and services
var Cellar=angular.module('cellar', [ 'cellar.services', 'cellar.directives',
                                     'SharedServices','cellar.auth']).
config(
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
			}).when('/404', {
				templateUrl : 'partials/404.xml'			
            }).otherwise({
				redirectTo : '/wines'
			});
		}]).
		run(function($rootScope, $location, Auth) {
  return $rootScope.$on('$routeChangeStart', function(event,next, current) {
    if (!Auth.isAuthenticated() && next.$route && next.$route.templateUrl == 'partials/users.xml') {
	  Auth.setReturn($location.$$url);
	  
      return $location.path("/auth/login");
    }
  });
});;
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
Cellar.controller("AppController", function($scope,$location, $window,flash,Auth) {
      $scope.username="";
      $scope.loggedIn=false
      $scope.auth=Auth;
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
	 $scope.flash = flash;
});


//http://plnkr.co/edit/3n8m1X?p=preview
Cellar.factory("flash", function($rootScope,$location) {
	  var queue = []
      var lasturl=""  //routeChangeSuccess called twice???
	  var showFlash=function(){
	    var ascope=angular.element("#alerts").scope()
		ascope.clear();
		for(var i = 0, len = queue.length; i < len; ++i){
			var a=queue[i]
			ascope.addAlert(a.type,a.msg);
		}
		queue = []
	  };
	  	$rootScope.$on('event:flash', function(event,msg) {
		  queue.push(msg);
		  $rootScope.$apply(showFlash);        
        });
	  $rootScope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute ) {
	    //console.log("routeChangeSuccess: ",queue.length,$location.$$absUrl )
		if(lasturl==$location.$$absUrl)return;
		lasturl=$location.$$absUrl;
		showFlash();
	  });
	  
	  return {
	    set: function(type,message) {
		  console.log("flash set")
	      queue.push({type:type,msg:message});
	    }
	  };
	});

