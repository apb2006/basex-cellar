Cellar.controller("UserCtrl",["User","$scope",
function(User,$scope){
	$scope.users= User.api.query();
}]);

Cellar.controller("UserDetailCtrl",['User','$routeParams', '$scope',
function (User, $routeParams, $scope) {
	$scope.user = User.api.get({userId: $routeParams.userId});
}]);


//---------------------------------------------------------------
Cellar.controller("WineListCtrl",["SortUtils","Flash","Wine", "$location", "$filter","$scope",
 function(SortUtils,Flash,Wine, $location, $filter,$scope) { 
	// sorting..
	$scope.head = Wine.sortableColumns;
	$scope.sortutils=SortUtils;
    var s=$location.search().sort
    $scope.sort=SortUtils.fromStr(s?s:"-modified")				

	 $scope.wines = Wine.api.query({});
	
	$scope.query="";
	
	$scope.$watch('sort', function(value) {
      $location.search( 'sort=' + $scope.sortutils.asStr(value));
    }, true);
   
	$scope.matchQ=function(wine){
	  return $scope.query?wine.name.toLowerCase().indexOf($scope.query.toLowerCase())!=-1:true
	};
    $scope.submit = function() {
		$scope.wines = Wine.api.query({q:$scope.view.q},
				function(){},
		        function(res){
		            Flash.add("error","Item <b>NOT</b> found: ");
		            $location.path("/wines");
                 });
		console.log("search");
		$location.path("/wines");
	};
	
    $scope.$on('wine:change', function() {
	    console.log('wine:change');
        $scope.wines = Wine.api.query(); 
    });   

}]);
//-------------------------------------------------------------
Cellar.controller("WineDetailCtrl",['Wine', 'Flash','$routeParams', '$location', '$scope',
  function (Wine,Flash, $routeParams, $location, $scope) {
	
    $scope.wine = Wine.api.get({wineId: $routeParams.wineId},function(){},
    		           function(res){
    	                 Flash.add("error","Item <b>NOT</b> found: "+$routeParams.wineId);
    	                 $location.path("/wines");
    	                 });
   
    $scope.saveWine = function () {
    	if(!$scope.myForm.$valid){
    		alert("please correct errors")
    	}
    	else if ($scope.wine.id )
        {
            Wine.api.update({wineId:$scope.wine.id}, $scope.wine, function (res) {
                Flash.add("success",'Wine <a href="#/wines/' + res.id +'">'+res.name + '</a> updated.'); 
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
            	Flash.add("success",'Wine <a href="#/wines/' + res.id +'">'+res.name + '</a> created.'); 
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
    	if(!confirm("Delete this wine?")){
    		
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
}]);
//---------------------------------------------------------------
Cellar.controller("GrapeListCtrl",['Flash','Grape', '$location', '$filter','$scope',
     function (Flash,Grape, $location, $filter,$scope) {

    var data= Grape.api.get({},
		    		function(){
    	$scope.grapes=data.items;
    },
			        function(res){
		    			
		    			console.log(res);
				        Flash.add("error","Bad news!!! ");
				        $location.path("/");
				     });
					
    $scope.query="";
	
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
	
}]);
//-------------------------------------------------------------
Cellar.controller("GrapeDetailCtrl",['Grape', '$routeParams', '$scope',
       function (Grape, $routeParams,  $scope) {	
    $scope.grape = Grape.api.get({grapeId: $routeParams.grapeId})
}]);

//------------------------------------------
Cellar.controller("SearchCtrl",['Search', '$location','$scope','$routeParams',
     function (Search, $location,$scope,$routeParams){
    $scope.q=$routeParams.q;
	$scope.results=Search.api.query({q:$scope.q});
	$scope.submit=function(){
		$location.path("/search");	
	};
	$scope.doSearch=function(){
		$scope.results=Search.api.query({q:$scope.q});
	};
}]);

//------------------------------------------
Cellar.controller("ErrorCtrl",['$scope','$location',function ($scope,$location){
    $scope.err='no error logged';
    $scope.logError=function (data){
    	 $scope.err=data;
    	 alert($scope.err)
    	// $location.path("/error");
    }
}]);

//------------------------------------------
Cellar.controller("BottleCtrl",['$scope','Bottle',function ($scope,Bottle){
 $scope.bottles=Bottle.api.query();
 console.log("bottleCtrl");
}]);

//------------------------------------------
Cellar.controller("EventCtrl",["$scope","Events",function ($scope,Events){
 $scope.events=Events.api.query();
 console.log("EventCtrl");
}]);


