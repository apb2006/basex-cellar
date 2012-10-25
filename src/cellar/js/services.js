//Syntax allows to chain factories
angular.module('cellar.services', ['ngResource']).
	//The factory returns objects / functions that can be used by the controllers
    factory('Wine', ['$resource', '$http', '$rootScope', function($resource, $http, $rootScope){
        return {
        	//the resource provider interacting with the BaseX backend
	        api: 
				$resource('../restxq/cellar/api/wines/:wineId', {}, {
			        update: {method:'PUT'}
				}),
			search: 
				$resource('../restxq/cellar/api/wines/search/:q', {}, {
			         
				}),
			/*
			* A generic function that can be called to emit an event on one ctrl that can be handled by another ctrl.
			* The WineDetailCtrl emits it on each save, update or delete request, so that the WineListCtrl can react and update itself.	
			*/
			broadcastChange: function(){
				$rootScope.$broadcast('handleBroadcast');
			}

		}
	}])