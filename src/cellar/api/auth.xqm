(:~ 
: user /auth  application 
: @author andy bunce
: @since jun 2012
:)

module namespace auth = 'apb.auth.app';
declare default function namespace 'apb.auth.app';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
import module namespace github = 'http://developer.github.com/v3/oauth/' at "oauth-github.xqm";
declare namespace rest = 'http://exquery.org/ns/restxq';
declare variable $auth:config:=
                            fn:doc(fn:resolve-uri("../../WEB-INF/site-config.xml"))/config                           
                            ;
declare variable $auth:Client-Id:=$auth:config/github/Client-Id;
declare variable $auth:Client-Secret:=$auth:config/github/Client-Secret;
                            
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

(:~
: login
: http://developer.github.com/v3/oauth/
:)
declare
%rest:GET %rest:path("cellar/auth/github")
%rest:form-param("code","{$code}")  
%rest:form-param("state","{$state}")  
function login($code,$state) {
   let $g:= github:login($auth:Client-Id,$auth:Client-Secret,$code,"")
   return fn:trace($g,"result")
};