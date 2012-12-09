/*
 * labs
 */
var Labs=angular.module('cellar.labs', [])
.config(
		[ '$routeProvider', function($routeProvider) {

			$routeProvider.when('/labs/grid', {
                templateUrl : 'labs/gridtest.xml',controller : "GridCtrl"
            }).when('/labs/select', {
                templateUrl : 'labs/select2.xml',controller : "Select2Ctrl"
            }).when('/labs/map', {
                templateUrl : 'labs/map.xml',controller : "MapCtrl"		
            }).when('/labs/ace', {
                templateUrl : 'labs/ace.xml' ,controller :"AceCtrl"
            }).when('/labs/sortable', {
                templateUrl : 'labs/sortable.xml' ,controller :"SortCtrl"
                 }).when('/labs/sortable2', {
                templateUrl : 'labs/sortable2.xml' ,controller :"Sort2Ctrl"
            })
		}]
);
//------------------------------------------
Labs.controller("MapCtrl",["$scope",function ($scope){
	$scope.myMarkers = [];

	$scope.mapOptions = {
		center: new google.maps.LatLng(45.767358, 4.834255),
		zoom:7,
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
Labs.controller("GridCtrl",["$scope",function ($scope){
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

//------------------------------------------
Labs.controller("Select2Ctrl",["$scope","Country",function ($scope,Country){
	$scope.select2="three";
	$scope.grape=["cf4ff8726b1141018d9396c18d80b2c6","518805c2176b4a02bacf16290e9910cc"]
	$scope.grapeFormatResult=function (grape){ 
		return "<div>"+grape.name+"</div>"
	};
    $scope.grapeFormatSelection= function(grape){
		return "<span style='background-color:yellow'>"+grape.name+"</span>"
	};
	$scope.countries= Country.api.query({},
		    		function(){
    	
    },
			        function(res){
		    			
		    			console.log(res);
				        Flash.add("error","Bad news!!! ");
				        $location.path("/");
				     });
      $scope.place="Spain";              
	}]);

//------------------------------------------
Labs.controller("AceCtrl",["$scope",function ($scope){
	$scope.bitchin="three";
	}]);
//------------------------------------------
Labs.controller("SortCtrl",["$scope","Country",function ($scope,Country){
	$scope.countries= Country.api.query();
	}]);
//------------------------------------------
Labs.controller("Sort2Ctrl",["$scope","Country",function ($scope,Country){
	$scope.countries= Country.api.query();
    $scope.selected= [];
    $scope.dclick = function($index) {
        alert("hi "+$index);
        console.log($index)
    };
 
  
	}]);
