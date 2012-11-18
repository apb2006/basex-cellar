/*
 * authorisation
 * based on http://vyazici.blogspot.com/2012/09/angularjs-authentication-service.html
 */
angular.module('cellar.auth', [])
.config(
		[ '$routeProvider', function($routeProvider,Auth) {

			$routeProvider.when('/auth/login', {
				templateUrl : 'auth/login.xml',controller:AuthController
			}).when('/auth/logout', {
            redirectTo: '/'  , resolve:AuthController.resolve
            }).when('/auth/register', {
				templateUrl : 'auth/register.xml'
            }).when('/auth/changepassword', {
				templateUrl : 'auth/changepassword.xml'
            }).when('/auth/lostpassword', {
				templateUrl : 'auth/lostpassword.xml'				
            }).when('/auth/profile', {
				templateUrl : 'auth/profile.xml'				
            })
            
		}])

.factory('Auth', ['Flash','$http','$route','$location',
                  function(Flash,$http,$route,$location) {
  console.log("Auth created")
  var _this = this;
  this.authenticated = false;
  this.name = null;
  this.role = null;
  this.returnURL="/";
  $http.get('../restxq/cellar/auth/session')
  .success(function(data){
     // Flash.show("info","Welcome to Angular cellar");
	 if(data.rc==0){
	     _this.name = data.name;
		  _this.role = data.role;
          _this.authenticated = true;
	 }else{
	  _this.authenticated = false;
	 }
  })
  .error(function(data){
  alert("Major problem at server: "+data)
	});  
  return {
    isAuthenticated: function() {
      return _this.authenticated;
    },
    getName: function() {
      return _this.name;
    },
    login: function(auth, callback) {
      return $http.post('../restxq/cellar/auth/login', auth).success(function(data) {
        if (data.name) {
          _this.name = data.name;
		  _this.role = data.role;
          _this.authenticated = true;
        }
        return callback(data.rc==0);
      }).error(function(data){
	         Flash.show("error","Bad thing!: "+data);
			 })
    },
	register: function(auth, callback) {
      return $http.post('../restxq/cellar/auth/register', auth).success(function(data) {
        if (data.name) {
          _this.name = data.name;
		  _this.role = data.role;
          _this.authenticated = true;
        }
          return callback(data.rc==0);
      }).error(function(data){
	         Flash.show("error","Bad thing!: "+data);
			 })
    },
    logout: function() {
      if (_this.authenticated) {
        return $http.post('../restxq/cellar/auth/logout', {}).success(function(data) {
          if (data.rc==0) {
            _this.authenticated = false;
			Flash.add("success","You are now logged out");
			$location.path("/")
			//$route.reload();
          }
          return true;
  
      } )
	  
	}},
	setReturn: function(url) {
	_this.returnURL=url;
    },
	getReturn: function() {
	 return _this.returnURL;
    }
}}]);

function AuthController(Flash,Auth, $location,$scope,$rootScope) {
  console.log("AuthController created")	
  $scope.auth={username:"",password:""};
  $scope.login = function() {
     // alert("hh");
    return Auth.login($scope.auth, function(result) {
      if (!result) {
	     Flash.show("error","Authentication failed!");
        return 
      } else {
	    var url=Auth.getReturn();
        return  $location.path(url);
        ;
      }
    });
  };
    $scope.register = function() {
     // alert("hh");
    return Auth.register($scope.auth, function(result) {
      if (!result) {
        return window.alert('Authentication failed!');
      } else {
	    var url=Auth.getReturn();
        return $scope.$apply(function() {
          return $location.path(url);
        });
      }
    });
  };
};
AuthController.$inject = ['Flash','Auth','$location',  '$scope',"$rootScope"];
AuthController.resolve={
	    pages: function(){
	    	alert("unused testing")
	    	return Auth.logout()
	    }
	}
