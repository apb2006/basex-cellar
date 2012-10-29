function UserCtrl(User, $location, $scope) {
    $scope.users = User.api.query();
}
UserCtrl.$inject = ['User', '$location', '$scope'];

function FlashCtrl( $scope) {
    $scope.alerts = [];
	$scope.addAlert = function(type,msg) {
            $scope.alerts.push({type:type,msg:msg});
        };
	$scope.clear = function() {
            $scope.alerts=[];
        };
	console.log("Flashcntl....................",$scope.alerts);
}
FlashCtrl.$inject = [ '$scope'];


function WineListCtrl(Wine, $location, $scope) {
    $scope.wines = Wine.api.query();
    $scope.q="";	
	
    $scope.submit = function() {
		$scope.wines = Wine.api.query({q:$scope.q});
		console.log("search");
		$location.path("/wines");
	};
	
    $scope.$on('wine:change', function() {
	    console.log('wine:change');
        $scope.wines = Wine.api.query(); 
    });   

}
WineListCtrl.$inject = ['Wine', '$location', '$scope'];


function WineDetailCtrl(Wine, $routeParams, $location, $scope) {
	var flash=function(type,msg){
		$scope.flash.set(type,msg);
	};
    $scope.wine = Wine.api.get({wineId: $routeParams.wineId},function(){},
    		           function(res){
    	                 flash("error","Item not found: "+$routeParams.wineId);
    	                 $location.path("/wines");
    	                 });
   
    $scope.saveWine = function () {
    	if(!$scope.myForm.$valid){
    		alert("please correct errors")
    	}
    	else if ($scope.wine.id )
        {
            Wine.api.update({wineId:$scope.wine.id}, $scope.wine, function (res) {
                flash("success",'Wine ' + $scope.wine.name + ' updated');
                Wine.broadcastChange();
                $location.path("/wines");
                },
                function(res){
                	flash("error",'Wine ' + $scope.wine.name + ' NOT updated: '+res.data);
                	//console.log(res);
                }
            );
        }
        //no match for wine means it's an empty form
        else
        {      
            Wine.api.save({}, $scope.wine, function (res) {
            	flash("success",'Wine ' + $scope.wine.name + ' created'); 
                Wine.broadcastChange();
                $location.path("/wines");
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
        	flash("success",'Wine ' + $scope.wine.name + ' deleted')
            
            Wine.broadcastChange();
            $location.path("/wines");
        },function(res){
        	alert("error:"+res.data)
        });
    	}
    }
}
WineDetailCtrl.$inject = ['Wine', '$routeParams', '$location', '$scope'];