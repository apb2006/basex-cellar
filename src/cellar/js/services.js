//Syntax allows to chain factories
angular.module('cellar.services', [ 'ngResource' ]).
// The factory returns objects / functions that can be used by the controllers
factory('Wine',
		['$resource','$http','$rootScope',
				function($resource, $http, $rootScope) {
					return {
						// the resource provider interacting with the BaseX
						// backend
						api : $resource('../restxq/cellar/api/wines/:wineId',
								{}, {
									update : {method : 'PUT'}
								}),
						/*
						 * The WineDetailCtrl emits it on each save, update or
						 * delete request, so that the WineListCtrl can react
						 * and update itself.
						 */
						broadcastChange : function() {
							$rootScope.$broadcast('wine:change');
						},
						countries : [ "France", "Spain", "Usa", "Italy",
								"Greece" ]

					}
				} ])
.factory('Grape',
		['$resource','$http','$rootScope',
				function($resource, $http, $rootScope) {
					return {
						// the resource provider interacting with the BaseX
						// backend
						api : $resource('../restxq/cellar/api/grapes/:grapeId',
								{}, {
									update : {
										method : 'PUT'
									}
								}),

						/*
						 * The WineDetailCtrl emits it on each save, update or
						 * delete request, so that the WineListCtrl can react
						 * and update itself.
						 */
						broadcastChange : function() {
							$rootScope.$broadcast('grape:change');
						}

					}
				} ])
.factory('User',
		[
				'$resource',
				'$http',
				'$rootScope',
				function($resource, $http, $rootScope) {
					return {
						// the resource provider interacting with the BaseX
						// backend
						api : $resource('../restxq/cellar/api/users/:userId',
								{}, {
									update : {method : 'PUT'}
								}),

						/*
						 * A generic function that can be called to emit an
						 * event on one ctrl that can be handled by another
						 * ctrl.
						 */
						broadcastChange : function() {
							$rootScope.$broadcast('user:change');
						}

					}
				} ])
.factory('Bottle', ['$resource','$http', function($resource,$http) {
                     console.log("Welcome to the bootle factory"); 
				     return {api : $resource('../restxq/cellar/api/pics/bottles')}
	
} ])				
.factory('Search', ['$resource','$http', function($resource,$http) {
				     return {api : $resource('../restxq/cellar/api/search?q=:q')}
	
} ])
.factory('Events', ['$resource','$http', function($resource,$http) {
				     return {api : $resource('../restxq/cellar/api/events')}
	
} ])
.factory('SortUtils', [ function() {
				     return {
				    	 // sort class
				    	 sortCls : function(column,view){
				    		 var desc="-"==view.sort.charAt(0);
				    		 var ccol=view.sort.substr(desc?1:0);
				    		 if(column == ccol){
				    				return desc?"icon-arrow-up":"icon-arrow-down"
				    		 }else{
				    				return "icon-"
				    			}		 
				    		 },
				    	 changeSorting : function(column,view){
				    		 var desc="-"==view.sort.charAt(0);
				    		 var ccol=view.sort.substr(desc?1:0);
				    		 if(column == ccol){
				    				view.sort=(desc?"":"-")+column
				    		 }else{
				    			 view.sort=column
				    			}		 
				    		 },
				    	activeCls:function(column,view){
				    		 var desc="-"==view.sort.charAt(0);
				    		 var ccol=view.sort.substr(desc?1:0);
				    		 return (column == ccol)?"active":"";
				     }	
} }])

