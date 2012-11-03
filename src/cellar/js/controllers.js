function UserCtrl(User, $location, $scope) {
    $scope.users = User.api.query();
    $scope.$on('event:auth-loginConfirmed', function() {
  	  alert("hi");
      });
};
UserCtrl.$inject = ['User', '$location', '$scope'];

function FlashCtrl( $scope) {
    $scope.alerts = [];
	$scope.addAlert = function(type,msg) {
            $scope.alerts.push({type:type,msg:msg});
        };
	$scope.clear = function() {
            $scope.alerts=[];
        };
}
FlashCtrl.$inject = [ '$scope'];


function WineListCtrl(Wine, $location, $filter,$scope) {
    $scope.wines = Wine.api.query({},
		    		function(){},
			        function(res){
		    			alert("Big problem: "+res.data);
		    			console.log(res);
				        flash("error","Bad news!!! ");
				        $location.path("/");
				     });
    $scope.query="";
	
	// sorting..
	 $scope.head = [
        {head: "Name", column: "name"},
        {head: "Created", column: "created"},
        {head: "Year", column: "year"},
		{head: "Updated", column: "changed"},
		];
	$scope.sort = { column: 'name', descending: false};
	
    $scope.selectedCls = function(column) {
	    if(column == $scope.sort.column){
			return $scope.sort.descending?"icon-arrow-up":"icon-arrow-down"
		}else{
			return "icon-"
		}		 
    };
    $scope.activeCls = function(column) {
	    return (column == $scope.sort.column)?"active":""
    };
    $scope.changeSorting = function(column) {
        var sort = $scope.sort;
        if (sort.column == column) {
            sort.descending = !sort.descending;
        } else {
            sort.column = column;
            sort.descending = false;
        }
    };
    $scope.submit = function() {
		$scope.wines = Wine.api.query({q:$scope.q},
				function(){},
		        function(res){
		            flash("error","Item not found: ");
		            $location.path("/wines");
                 });
		console.log("search");
		$location.path("/wines");
	};
	
    $scope.$on('wine:change', function() {
	    console.log('wine:change');
        $scope.wines = Wine.api.query(); 
    });   

}
WineListCtrl.$inject = ['Wine', '$location', '$filter','$scope'];


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

