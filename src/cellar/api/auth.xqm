(:~ 
: user /auth  application 
: @author andy bunce
: @since jun 2012
:)

module namespace auth = 'apb.auth.app';
declare default function namespace 'apb.auth.app';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
import module namespace users = 'apb.users.app' at "user-db.xqm";
import module namespace github = 'http://developer.github.com/v3/oauth/' at "oauth-github.xqm";
import module namespace session ="http://basex.org/modules/session";
declare namespace rest = 'http://exquery.org/ns/restxq';

declare variable $auth:config:=
                            fn:doc(fn:resolve-uri("../../WEB-INF/site-config.xml"))/config                           
                            ;
declare variable $auth:userdb:=db:open('cellar',"users.xml");							
declare variable $auth:Client-Id:=$auth:config/github/Client-Id;
declare variable $auth:Client-Secret:=$auth:config/github/Client-Secret;
                            
(:~
: return users auth required
:)
declare
%rest:GET %rest:path("cellar/api/users")  
%output:method("json")
function users() {
   let $uid:=session:get("uid")
   return if($uid)
		  then  <json arrays="json" objects="user">
		      {for $u in db:open('cellar',"users.xml")/users/user
			  return <user>
			      <id>{$u/@id/fn:string()}</id>
				  <name>{$u/@name/fn:string()}</name>
				  </user>}
		  </json>
          else web:http-auth("Whizz apb auth",())
};

(:~
: login 
: @return fail
:)
declare
%rest:path("cellar/auth/login")
%rest:POST("{$body}")  
%output:method("json")
updating function login-post($body)
{
 let $json:=$body/json
 let $u:=users:check-password($auth:userdb,$json/username,$json/password)
 return 
     if($u)
     then
	    let $json:= <json  objects="json">
		              <id>{$u/@id/fn:string()}</id>
					  <name>{$u/@name/fn:string()}</name>
					  <role>{$u/login/@role/fn:string()}</role>
				</json>
        return (
		   users:update-stats($auth:userdb,$u/@id), 
			db:output((
                session:set("uid", $u/@id/fn:string()),
                $json ))
				)
     else
	  db:output(web:status(422,"No good"))
};

declare
%rest:path("cellar/auth/logout")
%rest:POST("{$body}")  
%output:method("json")
 function logout-post($body){
  (session:delete("uid"),
   <json  objects="json"><ok/></json>)
};

declare
%rest:GET %rest:path("cellar/auth/session")
%output:method("json")
function session(){
 <json  objects="json"><uid>{session:get("uid")}</uid></json>
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