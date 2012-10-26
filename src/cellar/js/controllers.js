function UserCtrl(User, $location, $scope) {
    console.log("usercntl....................");
    $scope.users = User.api.query();
}
UserCtrl.$inject = ['User', '$location', '$scope'];

function LoginController( authService, $http,$scope) {
    $scope.submit = function() {
      $http.post('auth/login').success(function() {
        authService.loginConfirmed();
      });
    }
  }
LoginController.$inject = ['authService', '$location', '$scope'];

function WineListCtrl(Wine, $location, $scope) {
    $scope.wines = Wine.api.query();
    $scope.q="";	
	
    $scope.submit = function() {
		$scope.wines = Wine.api.query({q:$scope.q});
		console.log("search");
		$location.path("/thumbs");
	};
	
    $scope.$on('handleBroadcast', function() {
	    console.log('handleBroadcast');
        $scope.wines = Wine.api.query(); 
    });   

}
WineListCtrl.$inject = ['Wine', '$location', '$scope'];


function WineDetailCtrl(Wine, $routeParams, $location, $scope) {
    $scope.wine = Wine.api.get({wineId: $routeParams.wineId},function(){},
    		           function(res){
    	                 $scope.flash.set("Item not found: "+$routeParams.wineId);
    	                 $location.path("/thumbs");
    	                 });
   
    $scope.saveWine = function () {
    	if(!$scope.myForm.$valid){
    		alert("please correct errors")
    	}
    	else if ($scope.wine.id )
        {
            Wine.api.update({wineId:$scope.wine.id}, $scope.wine, function (res) {
                $scope.flash.set('Wine ' + $scope.wine.name + ' updated');
                Wine.broadcastChange();
                $location.path("/welcome");
                },
                function(res){
                	$scope.flash.set('Wine ' + $scope.wine.name + ' NOT updated: '+res.data);
                	//console.log(res);
                }
            );
        }
        //no match for wine means it's an empty form
        else
        {      
            Wine.api.save({}, $scope.wine, function (res) {
            	$scope.flash.set('Wine ' + $scope.wine.name + ' created'); 
                Wine.broadcastChange();
                $location.path("/thumbs");
                },
                function(res){
                	alert('Wine ' + $scope.wine.name + 'NOT created'); 	
                }
            );
        }
    }

    $scope.deleteWine = function () {
    	if(!$scope.myForm.$valid){
    		alert("please correct errors")
    	}else{ 
        Wine.api.delete({wineId:$scope.wine.id}, function(wine) {
        	$scope.flash.set('Wine ' + $scope.wine.name + ' deleted')
            
            Wine.broadcastChange();
            $location.path("/thumbs");
        },function(res){
        	alert("error:"+res.data)
        });
    	}
    }
}
WineDetailCtrl.$inject = ['Wine', '$routeParams', '$location', '$scope'];