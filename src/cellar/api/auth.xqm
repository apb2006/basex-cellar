(:~ 
: user /auth  application 
: @author andy bunce
: @since jun 2012
:)

module namespace users = 'apb.auth.app';
declare default function namespace 'apb.auth.app';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
declare namespace rest = 'http://exquery.org/ns/restxq';

(:~
: return users auth required
:)
declare
%rest:GET %rest:path("cellar/api/users")  
%output:method("json")
function users() {
   web:http-auth("Whizz apb auth",())
};

(:~
: login
:)
declare
%rest:GET %rest:path("cellar/auth/login")  
function login() {
   "login"
};
