'use strict';
/* http://docs.angularjs.org/#!angular.service */

// Declare app level module which depends on filters, and services
var Cellar=angular.module('cellar', [ 
        'cellar.services',
        'cellar.directives',
        'Error',
        'cellar.labs',
        '$strap.directives',
        'ngGrid',
        'services.httpRequestTracker',
        "ui.directives",
        'cellar.auth',
        'cellar.settings',
        'cellar.labs',
        'flasher'
        ]).
config(
        [ '$routeProvider', function($routeProvider) {

            $routeProvider.when('/wines', {
                templateUrl : 'partials/wine-thumbs.xml',controller: "WineListCtrl",
                reloadOnSearch: false
            })
            .when('/',{redirectTo : '/wines'})
            .when('/wines/add', {
               templateUrl : 'partials/wine-edit.xml',controller : "WineDetailCtrl"	,permission:".*"
            }).when('/wines/:wineId', {
                templateUrl : 'partials/wine-view.xml',controller : "WineDetailCtrl"
            }).when('/wines/:wineId/edit', {
                templateUrl : 'partials/wine-edit.xml',controller : "WineDetailCtrl",permission:".*"	
            }).when('/grapes', {
                templateUrl : 'partials/grape-list.xml',controller : "GrapeListCtrl"
            }).when('/grapes/:grapeId', {
                templateUrl : 'partials/grape-details.xml',controller : "GrapeDetailCtrl"

            }).when('/bottles', {
                templateUrl : 'partials/bottles.xml',
                controller : "BottleCtrl"		
            }).when('/search', {
                templateUrl : 'partials/search.xml',controller :"SearchCtrl"
            }).when('/users', {
                templateUrl : 'partials/user-list.xml',permission:".*",controller : "UserCtrl"
            }).when('/users/:userId', {
                templateUrl : 'partials/user-details.xml',permission:".*",controller : "UserDetailCtrl"	
            }).when('/tasks', {
                templateUrl : 'partials/tasks.xml',permission:"admin"
            }).when('/events', {
                templateUrl : 'partials/events.xml',controller : "EventCtrl"				
            }).when('/about', {
                templateUrl : 'partials/about.xml'			
            }).when('/resources', {
                templateUrl : 'partials/resources.xml'   		
            }).when('/404', {
                templateUrl : 'partials/404.xml'
            }).when('/error', {
                templateUrl : 'partials/error.xml'		
            }).otherwise({
                redirectTo : '/404'
            });
        }])
// picture filter, use generic if not set		
Cellar.filter('winePic', function() {
    return function(pic) {return pic ? "pics/bottles/"+pic : 'pics/generic.jpg';}
});
//picture filter, use generic if not set		
Cellar.filter('userPic', function() {
    return function(pic) {return pic ? "pics/users/"+pic : 'pics/users/guest.png';}
});
// e.g {{dateISO | moment:'M/D/YYYY h:m A'}}
Cellar.filter('moment', function() {
    return function(dateString, format) {return moment(dateString).format(format);}
});
Cellar.filter('fromNow', function() {
    return function(dateString) {return dateString?moment(dateString).fromNow():null;}
});

/* no hashbang within URLs for browers that support HTML5 history
Cellar.config(['$locationProvider', function($location) {
  $location.html5Mode(true); 
}]);
*/		
// http://www.bennadel.com/blog/2424-Setting-Prototype-Properties-Using-Inherited-Scope-Methods-In-AngularJS.htm
// Define our root-level controller for the application.
Cellar.controller("AppController", ["$scope","$location", "$window","Auth","Flash","httpRequestTracker",
  function($scope,$location, $window,Auth,Flash,httpRequestTracker) {
      $scope.auth=Auth;
      $scope.q=null;
      $scope.doSearch=function(){
          $location.path("/search").search({q: $scope.q});
      };
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
    $scope.hasPendingRequests = function () {
    return httpRequestTracker.hasPendingRequests();
  };
}]);

