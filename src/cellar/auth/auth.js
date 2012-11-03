/*
 * authorisation
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
//https://github.com/jhulick/the-issues-angularjs-demo
.factory('Auth', function() {
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
	});

function AuthController(authService, Auth, $http,$scope) {
    $scope.auth={username:"",password:""};
    $scope.login = function() {  
      $http.post('../restxq/cellar/auth/login',$scope.auth).
	  success(function() {
        authService.loginConfirmed();
      })
	  .error(function(data, status) {
	        alert("bad")
            $scope.data = data || "Request failed";
            $scope.status = status;        
        });
    }
  }
AuthController.$inject = ['authService','Auth', '$http', '$scope'];
