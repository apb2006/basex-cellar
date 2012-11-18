# Wine Cellar Application #

The original Wine Cellar application is documented [here](http://coenraets.org/blog/2012/02/sample-application-with-angular-js/).

It has been updated to Angular 1.0.2, and some new features have been implemented.

This is sample CRUD application built with Angular.js. The BaseX RESTXQ implementation is used for the back end.

## Authentication

All rest calls return a 401 if not autherised, but this is not used directly
Instead a custom permission property is  defined on route definitions
````
.when('/users', {templateUrl : 'partials/user-list.xml',
                 permission:"*",
                 controller : UserCtrl})
   
````
The `$routeChangeStart` event redirects to the login page if required. It stores the 
original destination to redirect after successful login.
````
$rootScope.$on('$routeChangeStart', function(event,next, current) {
    if (!Auth.isAuthenticated() && next.$route && next.$route.permission) {
      Auth.setReturn($location.$$url);
    //  Flash.add("warn","You must log in to access the page");
      return $location.path("/auth/login");
````


###  local

### Github

## Analytics

## Busy indicator

## error handling

## Server

Where possible the following structure is used for the xml.

````
<entity-name id="..">
 <meta created="date" [modified=".."] /> 
 <field>..</field>
 ...
 </entity-name>
```` 



