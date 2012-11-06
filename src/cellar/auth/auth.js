/*
 * authorisation
 * based on http://vyazici.blogspot.com/2012/09/angularjs-authentication-service.html
 */
angular.module('cellar.auth', [])
.config(
		[ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/auth/login', {
				templateUrl : 'auth/login.xml'
            }).when('/auth/register', {
				templateUrl : 'auth/register.xml'
            }).when('/auth/changepassword', {
				templateUrl : 'auth/changepassword.xml'
            }).when('/auth/lostpassword', {
				templateUrl : 'auth/lostpassword.xml'				
            })
		}])

.factory('Auth', function() {
  var _this = this;
  this.authenticated = false;
  this.name = null;
  this.role = null;
  this.returnURL=null;
  return {
    isAuthenticated: function() {
      return _this.authenticated;
    },
    getName: function() {
      return _this.name;
    },
    login: function(auth, callback) {
      return $.post('../restxq/cellar/auth/login', auth, (function(data) {
        if (data.name) {
          _this.name = data.name;
		  _this.role = data.role;
          _this.authenticated = true;
        }
        return callback(data.rc==0);
      }), 'json');
    },
	register: function(auth, callback) {
      return $.post('../restxq/cellar/auth/register', auth, (function(data) {
        if (data.name) {
          _this.name = data.name;
		  _this.role = data.role;
          _this.authenticated = true;
        }
        return callback(data.rc==0);
      }), 'json');
    },
    logout: function(callback) {
      if (_this.authenticated) {
        return $.post('../restxq/cellar/auth/logout', {}, (function(data) {
          if (data.rc==0) {
            _this.authenticated = false;
          }
          return callback(true);
        }), 'json');
      } else {
        return callback(false);
      }
    },
	setReturn: function(url) {
	_this.returnURL=url;
    },
	getReturn: function() {
	 return _this.returnURL;
    }
}});

function AuthController(Auth, $location,$scope,$rootScope) {
  $scope.auth={username:"",password:""};
  $scope.login = function() {
     //alert("hh");
    return Auth.login($scope.auth, function(result) {
      if (!result) {
	     $rootScope.$broadcast('event:flash',{type:"error",msg:"Authentication failed!"});
        return 
      } else {
	    var url=Auth.getReturn();
        return $scope.$apply(function() {
          return $location.path(url);
        });
      }
    });
  };
    $scope.register = function() {
     //alert("hh");
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
AuthController.$inject = ['Auth','$location',  '$scope',"$rootScope"];

