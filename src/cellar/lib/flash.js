/* flash msg notification like express.js targeting bootstrap
 * based on:
 *  https://github.com/Yeti-Media/angular-notice
 *  http://plnkr.co/edit/3n8m1X?p=preview
*/
'use strict';

angular.module('Notification', []).factory('$flash', function($rootScope) {
    var service = {
        notify : function(level, message, element, callback){
                   var notification = {
                     level: level,
                     message: message,
                     element: (element || 'default'),
                     callback: callback
                   };
                   $rootScope.$emit("event:ngNotification", notification);
                 }
        };
    return service;
  }).directive('ngNotice', function($rootScope) {
    var noticeObject = {
       replace: false,
       transclude: false,
       link: function (scope, element, attr){
         $rootScope.$on("event:ngNotification", function(event, notification){
           if (attr.ngNotice == notification.element){
             element.html("<span class=\""+ notification.level +
                          "\">" + notification.message + "</span>");
             if (typeof notification.callback === 'function'){
               notification.callback();
             }
           }
         });
         element.attr('ng-notice',(attr.ngNotice || 'default'));
       }
    };
    return noticeObject;
});