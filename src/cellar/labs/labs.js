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
Labs.controller("MapCtrl",["$scope","Userdata","Auth",function ($scope,Userdata,Auth){
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
    $scope.clearMarkers = function() {
        $scope.myMarkers.forEach(function(m){m.setMap(null)});
        $scope.myMarkers=[];
	};
	$scope.setZoomMessage = function(zoom) {
		$scope.zoomMessage = 'You just zoomed to '+zoom+'!';
		console.log(zoom,'zoomed');
	};

	$scope.openMarkerInfo = function(marker) {
		$scope.currentMarker = marker;
        $scope.currentMarkerIndex =$scope.myMarkers.indexOf(marker);
		$scope.currentMarkerLat = marker.getPosition().lat();
		$scope.currentMarkerLng = marker.getPosition().lng();
		$scope.myInfoWindow.open($scope.myMap, marker);
	};

	$scope.setMarkerPosition = function(marker, lat, lng) {
		marker.setPosition(new google.maps.LatLng(lat, lng));
	};
    $scope.dumpMarkers = function() {
		console.log(JSON.stringify(markerAsLatLng($scope.myMarkers)));
	};
    $scope.testMarkers = function() {
        $scope.clearMarkers();
		$scope.myMarkers=latLngAsMarker(JSON.parse(saved),$scope.myMap);
	};
    $scope.loadMarkers = function() {
		var m=Userdata.api.get({field: "markers",userid:Auth.getId()},
				    function(res){
			             var m=res.markers;
			             $scope.clearMarkers();
			     		 $scope.myMarkers=latLngAsMarker(m,$scope.myMap);
					},
    		           function(res){   	                
    	                 console.log(res);
    	                 alert(res);
    	                 });
		
	};
    
    $scope.deleteMarker = function(index) {
        $scope.myMarkers[index].setMap(null);
        $scope.myMarkers.splice(index,1)
	};
    
	$scope.saveMarkers=function(){
		var m={markers:markerAsLatLng($scope.myMarkers)};
        Userdata.api.update(
        		    {field: "markers",userid:Auth.getId()},
        		    m,function(){alert("Saved")},
    		           function(res){
    	                 alert(res)
    	                 });
	};
    
    function markerAsLatLng(markers){
     var f=function(marker){return {lat:marker.getPosition().lat(),lng:marker.getPosition().lng()}};    
     return markers.map(f)
    };
    
    function latLngAsMarker(latlngs,map){
     var f=function(latlng){
            return new google.maps.Marker({map: map, position: new google.maps.LatLng(latlng.lat, latlng.lng)})
     };
     return latlngs.map(f)
    };
    var saved='[{"lat":46.927758623434435,"lng":5.20751953125},{"lat":46.92025531537451,"lng":6.448974609375},{"lat":46.6795944656402,"lng":5.0537109375}]';
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
	$scope.countries= Country.api.query({});
//	http://stackoverflow.com/questions/13253114/angular-ui-select2-sometimes-not-loading-model
	$scope.$watch('countries',function (newVal,oldVal,$scope){
	      if(newVal){
	    	  setTimeout(function(){
	    	  $scope.place="Spain";
	          $scope.place2="France";
	    	  })
	      }
	    },true);
	$scope.setPlace=function(){
	 $scope.place="Chad";
    $scope.place2="XYZ";
	};
	}]);

//------------------------------------------
Labs.controller("AceCtrl",["$scope",function ($scope){
	$scope.bitchin="module namespace users = 'apb.users.app'\n" 
                   +"declare default function namespace 'apb.users.app';\n"
                   +"declare function find-name(\n"
                   +" $userDb,\n"
                   +"$username as xs:string)  as element(user)?\n"
                  +"{\n" 
                   +"$userDb/users/user[name=$username]\n"
                  +"};\n"
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


//The factory returns objects / functions that can be used by the controllers
Labs.factory('Userdata',
     ['$resource','$http','$rootScope',"Auth",
             function($resource, $http, $rootScope) {
                 return {
                     // the resource provider interacting with the BaseX
                     // backend
                     api : $resource('../restxq/cellar/api/users/:userid/data/:field',
                             {}, {
                                 update : {method : 'PUT'}
                             }),
                   
                     broadcastChange : function() {
                         $rootScope.$broadcast('userdata:change');
                     }
                 }
             } ]);
      
             