/*
* service for "flash' messages. Messages can be displayed immediately or on next page change
* Usage:
*     To send:
*         Inject Flash into controler and call Flash.add for flash after change, or Flash.show
*     To display:
*         $scope.alerts=[]; 
*	      $scope.$on('showflash', function(event) {
*		     $scope.alerts=Flash.msgs();
*	      });
* http://plnkr.co/edit/3n8m1X?p=preview
*/
angular.module('flasher', [])
.factory("Flash", function($rootScope,$location) {
	  var queue = []
      var lasturl=""  //routeChangeSuccess called twice???
	  var tell=function(){
	   if(queue.length) $rootScope.$broadcast('showflash');
	  };
	  $rootScope.$on('$routeChangeSuccess', function($currentRoute, $previousRoute ) {
	    //console.log("routeChangeSuccess: ",queue.length,$location.$$absUrl )
		if(lasturl==$location.$$absUrl)return;
		lasturl=$location.$$absUrl;
		$rootScope.$broadcast('showflash');
	  });
	  
	  return {
	    add: function(type,message) {
//		  console.log("flash set")
	      queue.push({type:type,msg:message});
	    },
		msgs:function() {
		  var a=angular.copy(queue);
		  queue=[];
	      return a;
	    },
		show:function(type,message) {
//		  console.log("flash show")
	      queue.push({type:type,msg:message});
		  $rootScope.$broadcast('showflash')
	  }
	}});

