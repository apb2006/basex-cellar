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


declare variable $auth:userdb:=db:open('cellar',"users.xml");							
                            
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
%rest:form-param("username", "{$username}" )
%rest:form-param("password", "{$password}" )
%output:method("json")
updating function login-post($username as xs:string,$password as xs:string)
{
 let $u:=users:check-password($auth:userdb,$username,$password)
 return 
     if($u)
     then
	    let $json:= <json  objects="json">
		              <rc>0</rc>
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
	  db:output(<json  objects="json"><rc>1</rc></json>)
};

declare
%rest:path("cellar/auth/logout")
%rest:POST("{$body}")  
%output:method("json")
 function logout-post($body){
  (session:delete("uid"),
   <json  objects="json"><rc>0</rc></json>)
};

declare 
%rest:path("cellar/auth/register") 
%rest:form-param("username", "{$username}" )
%rest:form-param("password", "{$password}" )
%output:method("json")
updating function register-post($username as xs:string,$password as xs:string)
{
    if(users:find-name($auth:userdb,$username))
    then 
        let $t:= "The name '" || $username || "' is already registered, please choose different name."
       
        return db:output(
                         <json objects="json"><msg>{$t}</msg></json>
                         )
    else
        let $t:=$username || " your registration was successful. " 
                          
        return (
            users:create($auth:userdb,$username,$password),
            
            db:output((
            session:set("uid", fn:string(users:next-id($auth:userdb))),
            <json objects="json"><msg>{$t}</msg></json>
            ))
    )
};

declare
%rest:GET %rest:path("cellar/auth/session")
%output:method("json")
function session(){
 <json  objects="json"><uid>{session:get("uid")}</uid></json>
};

declare
%rest:GET %rest:path("cellar/auth/github")
function github(){
  github:authorize()
};

(:~
: login
: http://developer.github.com/v3/oauth/
:)
declare
%rest:GET %rest:path("cellar/auth/github/callback")
%rest:form-param("code","{$code}")  
%rest:form-param("state","{$state}")  
function login($code,$state) {
   let $token:= github:login($code,"")
   return if($token)
          then github:user($token)
          else <fail></fail>
};