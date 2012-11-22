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
							$rootScope.$broadcast('wine:change');
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
							$rootScope.$broadcast('userevent');
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

