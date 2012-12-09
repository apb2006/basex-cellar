/*
 * authorisation
 * based on http://vyazici.blogspot.com/2012/09/angularjs-authentication-service.html
 */
angular.module('cellar.auth', [])
.config(
		[ '$routeProvider', function($routeProvider,Auth) {

			$routeProvider.when('/auth/login', {
				templateUrl : 'auth/login.xml',controller:"AuthController"
			}).when('/auth/logout', {
            redirectTo: '/'  , resolve:"AuthController.resolve"
            }).when('/auth/register', {
				templateUrl : 'auth/register.xml'
            }).when('/auth/changepassword', {
				templateUrl : 'auth/changepassword.xml',permission:".*"
            }).when('/auth/lostpassword', {
				templateUrl : 'auth/lostpassword.xml'				
            })
            
		}])
.run(function($rootScope, $location, Auth,Flash) {
  return $rootScope.$on('$routeChangeStart', function(event,next, current) {
    if(!(next.$route && next.$route.permission))return
	 var msg=null;
	  if(!Auth.isAuthenticated()){
		msg="You must be logged in to access this part of the application."
	  }else if(!Auth.hasRole(next.$route.permission)){
		msg="You do not have the necessary access permissions.  Do you want to signin as someone else?"
	  }
	  if(msg){
		  Auth.setReturn($location.$$url);
		  Flash.add("warn",msg);
		  return $location.path("/auth/login");
	  }
    })
})
.factory('Auth', ['Flash','$http','$route','$location',
                  function(Flash,$http,$route,$location) {
  console.log("Auth created")
  var _this = this;
  this.authenticated = false;
  this.name = null;
  this.role = null;
  this.returnURL="/";
  this.set=function(data){
    _this.name = data.name;
	_this.role = data.role;
	_this.avatar = data.avatar;
    _this.authenticated = true;
  };
  $http.get('../restxq/cellar/auth/session')
  .success(function(data){
     // Flash.show("info","Welcome to Angular cellar");
	 if(data.rc==0){
	     _this.set(data)
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
    getAvatar: function() {
        return _this.avatar;
      },
	hasRole: function(roleRe) {
	   var re=new RegExp(roleRe);
      return re.test(_this.role);
    },
    login: function(auth, callback) {
      return $http.post('../restxq/cellar/auth/login', auth).success(function(data) {
        if (data.name) {
          _this.set(data);
        }
        return callback(data.rc==0);
      }).error(function(data){
	         Flash.show("error","Bad thing!: "+data);
			 })
    },
	register: function(auth, callback) {
		
      return $http.post('../restxq/cellar/auth/register', auth).success(function(data) {
        if (data.name) {
          _this.set(data);
        }
          return callback(data.rc==0);
      }).error(function(data){
	         Flash.show("error","Bad thing!: "+data);
			 })
    },
   
    logout: function(callback) {
      if (_this.authenticated) {
        return $http.post('../restxq/cellar/auth/logout', {})
               .success(function(data) {
	        	_this.authenticated = false;
	            callback(data);
	          })
          }else{
          return callback();
  
      } 
	  
	},
	changepassword:function(newpass,callback) {
		return $http.post('../restxq/cellar/auth/changepassword', newpass).success(function(data) {
			callback(data)
		})
		
	},
	lostpassword:function(){
		alert("Not yet");
	},
	
	setReturn: function(url) {
	_this.returnURL=url;
    },
    
	getReturn: function() {
	 return _this.returnURL;
    }
}}])
.controller("AuthController",["Flash","Auth", "$location","$scope",
  function (Flash,Auth, $location,$scope) {
  console.log("AuthController created")	
  $scope.auth={username:"",password:""};
  $scope.newpass={newpassword:"",password:""};
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
	    Flash.add("success","Registration successful. Welcome");
	    var url=Auth.getReturn();
        return $location.path(url);
        ;
      }
    });
  };
  $scope.changepassword = function(){ 
		  return Auth.changepassword($scope.newpass,function(data){
			  if (data.rc==0) {
					Flash.add("success","Your password has been changed.");
					$location.path("/")
					//$route.reload();
		     }else{
		    	 Flash.show("error","Current password incorrect!");
		     }
		  })
  };
  $scope.logout = function(){
	 Auth.logout(function(data){
		 if (data.rc==0) {
			Flash.add("success","You are now signed out");
			$location.path("/")
			//$route.reload();
		 }
	 	})
  };
}]);
