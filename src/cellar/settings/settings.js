angular.module('cellar.settings', [])
.config(
		[ '$routeProvider', function($routeProvider,Auth) {
			$routeProvider.when('/settings/:view', {
             templateUrl : 'settings/settings.xml',permission:".*",controller: "SettingsCtrl"									
            })
		}])
.controller("SettingsCtrl",["$scope","$routeParams","Auth",function ($scope,$routeParams,Auth){
	$scope.auth=Auth;
    $scope.view=$routeParams.view;
    $scope.pages=[
                  {name:"account",src:"settings/account.xml"},
                  {name:"password",src:"auth/changepassword.xml"},
                  {name:"profile",src:"settings/profile.xml"},
                  {name:"email",src:"settings/email.xml"},
                  {name:"notifications",src:"settings/notifications.xml"}
                  ];
    
    $scope.src=function(){
    	var hit=$scope.pages.filter(function( obj ) {
            return obj.name === $scope.view;
        })[ 0 ];
       return hit.src
    };
    $scope.clsActive=function(){
    	return "" //($scope.pages[$index].name==$scope.view)?"active":""
    };
 console.log("SettingsCtrl");
}])		