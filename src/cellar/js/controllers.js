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
    $scope.wines = Wine.api.query({},
		    		function(){},
			        function(res){
		    			//alert("Big problem: "+res.data);
		    			console.log(res);
				        Flash.add("error","Bad news!!! ");
				        $location.path("/");
				     });
					
    $scope.query="";
	console.dir($location.search())
	// sorting..
	 $scope.head = [
        {head: "Name", column: "name"},
		{head: "Year", column: "year"},
        {head: "Created", column: "created"},
		{head: "Updated", column: "modified"},
		];
	$scope.sort = { column: 'modified', descending: true};
	$scope.view={q:"",sort:"-modified"};
	$scope.sortutils=SortUtils;
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
	  return $scope.query?wine.name.toLowerCase().indexOf($scope.query.toLowerCase())!=-1:true
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

}]);
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
}
WineDetailCtrl.$inject = ['Wine', 'Flash','$routeParams', '$location', '$scope'];
//---------------------------------------------------------------
function GrapeListCtrl(Flash,Grape, $location, $filter,$scope) {

    var data= Grape.api.get({},
		    		function(){
    	$scope.grapes=data.grapes;
    },
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
function GrapeDetailCtrl(Grape,Flash, $routeParams, $location, $scope) {	
    $scope.grape = Grape.api.get({grapeId: $routeParams.grapeId})
};
GrapeDetailCtrl.$inject = ['Grape', 'Flash','$routeParams', '$location', '$scope'];


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

//------------------------------------------
Cellar.controller("MapCtrl",["$scope",function ($scope){
	$scope.myMarkers = [];

	$scope.mapOptions = {
		center: new google.maps.LatLng(35.784, -78.670),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	$scope.addMarker = function($event) {
		$scope.myMarkers.push(new google.maps.Marker({
			map: $scope.myMap,
			position: $event.latLng
		}));
	};

	$scope.setZoomMessage = function(zoom) {
		$scope.zoomMessage = 'You just zoomed to '+zoom+'!';
		console.log(zoom,'zoomed');
	};

	$scope.openMarkerInfo = function(marker) {
		$scope.currentMarker = marker;
		$scope.currentMarkerLat = marker.getPosition().lat();
		$scope.currentMarkerLng = marker.getPosition().lng();
		$scope.myInfoWindow.open($scope.myMap, marker);
	};

	$scope.setMarkerPosition = function(marker, lat, lng) {
		marker.setPosition(new google.maps.LatLng(lat, lng));
	};
 console.log("MapCtrl");
}]);
//------------------------------------------
Cellar.controller("GridCtrl",["$scope",function ($scope){
	$scope.myData = [{name: "Moroni", age: 50},
                     {name: "Tiancum", age: 43},
                     {name: "Jacob", age: 27},
                     {name: "Nephi", age: 29},
                     {name: "Enos", age: 34}];
	for (var i=0;i<1000;i++){
		$scope.myData.push({name: "Jacob"+i, age: i % 100})
	}
    $scope.myOptions = { data: 'myData' };
 console.log("GridCtrl");
}]);
