function UserCtrl(User,$scope){
	$scope.users= User.api.query();
};
UserCtrl.$inject = ['User', '$scope'];

function UserDetailCtrl(User, $routeParams,$location, $scope) {
	$scope.user = User.api.get({userId: $routeParams.userId});
	console.log("UserDetailCtrl")
};
UserDetailCtrl.$inject = ['User','$routeParams', '$location','$scope'];

//---------------------------------------------------------------
function WineListCtrl(Flash,Wine, $location, $filter,$scope) {
    $scope.wines = Wine.api.query({},
		    		function(){},
			        function(res){
		    			//alert("Big problem: "+res.data);
		    			console.log(res);
				        Flash.add("error","Bad news!!! ");
				        $location.path("/");
				     });
					
    $scope.query="";
	
	// sorting..
	 $scope.head = [
        {head: "Name", column: "name"},
		{head: "Year", column: "year"},
        {head: "Created", column: "created"},
		{head: "Updated", column: "modified"},
		];
	$scope.sort = { column: 'name', descending: false};
	
	$scope.$watch('sort', function(value) {
      $location.search( 'sort=' + (value.descending?"-":"")+ value.column);
    }, true);
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
	$scope.matchQ=function(wine){
	  return $scope.query?wine.name.indexOf($scope.query)!=-1:true
	};
    $scope.submit = function() {
		$scope.wines = Wine.api.query({q:$scope.q},
				function(){},
		        function(res){
		            Flash.add("error","Item not found: ");
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
WineListCtrl.$inject = ['Flash','Wine', '$location', '$filter','$scope'];
//---------------------------------------------------------------
function GrapeListCtrl(Flash,Grape, $location, $filter,$scope) {

    $scope.grapes = Grape.api.query({},
		    		function(){},
			        function(res){
		    			
		    			console.log(res);
				        Flash.add("error","Bad news!!! ");
				        $location.path("/");
				     });
					
    $scope.query="";
	
	// sorting..
	 $scope.head = [
        {head: "Name", column: "name"},
        {head: "Created", column: "created"},
        {head: "Year", column: "year"},
		{head: "Updated", column: "modified"},
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
		$scope.grapes = Grape.api.query({q:$scope.q},
				function(){},
		        function(res){
		            Flash.add("error","Item not found: ");
		            $location.path("/wines");
                 });
		console.log("search");
		$location.path("/grapes");
	};
	
    $scope.$on('wine:change', function() {
	    console.log('wine:change');
        $scope.wines = Wine.api.query(); 
    });   

}
GrapeListCtrl.$inject = ['Flash','Grape', '$location', '$filter','$scope'];

//-------------------------------------------------------------
function WineDetailCtrl(Wine,Flash, $routeParams, $location, $scope) {
	
    $scope.wine = Wine.api.get({wineId: $routeParams.wineId},function(){},
    		           function(res){
    	                 Flash.add("error","Item not found: "+$routeParams.wineId);
    	                 $location.path("/wines");
    	                 });
   
    $scope.saveWine = function () {
    	if(!$scope.myForm.$valid){
    		alert("please correct errors")
    	}
    	else if ($scope.wine.id )
        {
            Wine.api.update({wineId:$scope.wine.id}, $scope.wine, function (res) {
                Flash.add("success",'Wine ' + $scope.wine.name + ' updated');
                Wine.broadcastChange();
                $location.path("/wines");
                },
                function(res){
                	Flash.add("error",'Wine ' + $scope.wine.name + ' NOT updated: '+res.data);
                	//console.log(res);
                }
            );
        }
        //no match for wine means it's an empty form
        else
        {      
            Wine.api.save({}, $scope.wine, function (res) {
            	Flash.add("success",'Wine ' + $scope.wine.name + ' created'); 
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
        	Flash.add("success",'Wine ' + $scope.wine.name + ' deleted')
            
            Wine.broadcastChange();
            $location.path("/wines");
        },function(res){
        	alert("error:"+res.data)
        });
    	}
    };
    $scope.countries=Wine.countries;
}
WineDetailCtrl.$inject = ['Wine', 'Flash','$routeParams', '$location', '$scope'];

//------------------------------------------
function SearchCtrl(Search, $location,$scope,$routeParams){
    $scope.q=$routeParams.q;
	$scope.results=Search.api.query({q:$scope.q});
	$scope.submit=function(){
		$location.path("/search");	
	};
	$scope.doSearch=function(){
		$scope.results=Search.api.query({q:$scope.q});
	};
};
SearchCtrl.$inject = [ 'Search', '$location','$scope','$routeParams'];

//------------------------------------------
function ErrorCtrl($scope,$location){
    $scope.err='no error logged';
    $scope.logError=function (data){
    	 $scope.err=data;
    	 alert($scope.err)
    	// $location.path("/error");
    }
};
ErrorCtrl.$inject = [ '$scope','$location'];

//------------------------------------------
function BottleCtrl($scope,Bottle){
 $scope.bottles=Bottle.api.query();
 console.log("bottleCtrl");
};
BottleCtrl.$inject = [ '$scope','Bottle'];
//------------------------------------------
function EventCtrl($scope,Events){
 $scope.events=Events.api.query();
 console.log("EventCtrl");
};
EventCtrl.$inject = [ '$scope',"Events"];

