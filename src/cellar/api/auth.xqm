(:~ 
: user /auth  application 
: @author andy bunce
: @since jun 2012
:)

module namespace auth = 'apb.auth.app';
declare default function namespace 'apb.auth.app';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
import module namespace users = 'apb.users.app' at "user-db.xqm";
import module namespace events = 'apb.cellar.event' at "events.xqm";

import module namespace github = 'http://developer.github.com/v3/oauth/' at "github-oauth.xqm";
import module namespace github-db = 'apb.github.db' at "github-db.xqm";

import module namespace session ="http://basex.org/modules/session";
declare namespace rest = 'http://exquery.org/ns/restxq';


declare variable $auth:userdb:=db:open('users',"users.xml");							
declare variable $auth:gitdb:=db:open('users',"github.xml"); 
                           
(:~
: login 
: @return fail
:)
declare
%rest:path("cellar/auth/login")
%rest:POST("{$body}")  
%output:method("json")
updating function login-post(
	$body)
{
 let $json:=$body/json 
 let $u:=users:password-check($auth:userdb,$json/username,$json/password)
 return 
     if($u) then
         (
		   users:update-stats($auth:userdb,$u/@id),
		   events:log("login",$json/username,$u/@id,$json/username), 
			db:output((
                session:set("uid", $u/@id/fn:string()),
                session-user($u) ))
				)
     else
	  db:output(session-user(()) )
};

declare
%rest:path("cellar/auth/logout")
%rest:POST("{$body}")  
%output:method("json")
function logout-post(
	$body)
{
  (session:delete("uid"),
   <json  objects="json"><rc>0</rc></json>)
};

declare 
%rest:path("cellar/auth/register") 
%rest:POST("{$body}")  
%output:method("json")
updating function register-post(
	$body)
{
    let $json:=$body/json
    let $username as xs:string:=  $json/username/fn:string()
	let $password as xs:string:=  $json/password/fn:string()
    return if(users:find-name($auth:userdb,$username))
    then 
        let $t:= "The name '" || $username || "' is already registered, please choose different name."
       
        return db:output((web:status(409,"Duplicate"),
                         <json objects="json"><msg>{$t}</msg></json>
                         ))
    else
        let $u:=users:generate($auth:userdb,$username,"local",$password)
        return (
            users:create($auth:userdb,$u),
            events:log("register",$username,0,$username), 
            db:output((
                session:set("uid", $u/@id/fn:string()),
                session-user($u) ))
           
            )
};

declare
%rest:GET %rest:path("cellar/auth/session")
%output:method("json")
function session()
{
 let $uid:=session:get("uid")
 let $u:=users:find-id($auth:userdb,$uid)
 return session-user($u) 
};

declare 
%rest:path("cellar/auth/changepassword") 
%rest:POST("{$body}")  
%output:method("json")
updating function changepassword(
	$body)
{
   let $json:=$body/json
   let $newpassword as xs:string:=  $json/newpassword/fn:string()
   let $password as xs:string:=  $json/password/fn:string()
   let $u:=users:find-id($auth:userdb,session:get("uid"))
   
   return if($u) then
           users:password-change($u,$newpassword)
          else db:output(
   <json  objects="json">
         <rc>1</rc>
         <msg>Not logged in</msg>
   </json>)
};

(:~
:  session info for user
:)
declare %private function session-user(
   $u as element(user)?)
{
    if($u) then
         <json  objects="json">
                  <rc>0</rc>
                  <id>{$u/@id/fn:string()}</id>
                  <name>{$u/name/fn:string()}</name>
                  <role>{$u/role/fn:string()}</role>
            </json>
    else
         <json  objects="json">
                  <rc>1</rc>
            </json>
};

(:----------------------:)
declare
%rest:GET %rest:path("cellar/auth/github")
function github()
{
  github:authorize()
};

(:~
: github login callback
: http://developer.github.com/v3/oauth/
:)
declare
%rest:GET %rest:path("cellar/auth/github/callback")
%rest:form-param("code","{$code}")  
%rest:form-param("state","{$state}")
%output:method("json")  
updating function login-github(
  $code,
  $state)
{
   let $token:= github:get-access-token($code,"")
   return if($token) then 
            let $github-profile:=github:user($token)
            let $github-user:=$github-profile/json/login/fn:string()
            let $exists:=users:find-external($auth:userdb,"github",$github-user)
            let $user:=if($exists) then $exists
                       else users:generate($auth:userdb,$github-user,"github",$github-user)			
            return (
               if($exists) then users:update-stats($auth:userdb,$user/@id)
			               else users:create($auth:userdb,$user), 
               github-db:ensure($auth:gitdb,$github-user,$github-profile),
                events:log("github",$github-user,$user/@id,$github-user), 
               db:output((session:set("uid", $user/@id/fn:string()),
			             web:redirect("/cellar"))
			            )
               )
           else
               db:output( <json  objects="json">
                  <rc>1</rc>
                  <msg>Not approved</msg>
            </json>)
};