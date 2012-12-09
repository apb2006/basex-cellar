(:~ 
: user /auth  application
:      
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

import module namespace twitter = 'https://api.twitter.com/oauth/authenticate' at "twitter-oauth.xqm";

import module namespace request = "http://exquery.org/ns/request";
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
		   events:log2("login","local",$u), 
			db:output((
                session:set("uid", $u),
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
            events:log2("register","local",$u), 
            db:output((
                session:set("uid", $u),
                session-user($u) ))
           
            )
};

declare
%rest:GET %rest:path("cellar/auth/session")
%output:method("json")
function session()
{
 let $u:=session:get("uid")
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
   let $u:=session:get("uid")
   
   return if($u) then
           let $u:=users:password-check($u,$password)
           return if($u) then
               (users:password-change($u,$newpassword),
               db:output(rc(0,"password changed"))
               )
               else db:output(rc(2,"Existing password incorrect"))
          else db:output(rc(1,"Not logged in"))
  
};

declare 
%rest:path("cellar/auth/lostpassword") 
%rest:POST("{$body}")  
%output:method("json")
updating function lostpassword(
    $body)
{
   let $json:=$body/json
   let $email as xs:string:=  $json/email/fn:string()
   
   return db:output(rc(5,"Not yet")) 
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
                  <avatar>{$u/avatar/fn:string()}</avatar>
            </json>
    else rc(1,"not logged in")
        
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
            let $avatar:=$github-profile/json/avatar__url/fn:string()
            return (
             github-db:ensure($auth:gitdb,$github-user,$github-profile),
             remote-login($github-user,$auth:userdb,"github")
             )
           else
               db:output(rc(1,"Not approved"))
};

(:----------------------:)
declare
%rest:GET %rest:path("cellar/auth/twitter")
function twitter()
{
  let $uri:=request:uri() || "/callback"
  return twitter:authorize($uri)
};

(:~
: twitter login callback
:)
declare
%rest:GET %rest:path("cellar/auth/twitter/callback")
%rest:form-param("oauth_token","{$oauth_token}")  
%rest:form-param("oauth_verifier","{$oauth_verifier}")
%output:method("text")  
updating  function login-twitter(
  $oauth_token,
  $oauth_verifier)
{
    let $twitter-user:=twitter:login($oauth_token,$oauth_verifier)
    return remote-login($twitter-user,$auth:userdb,"twitter")
};

(:~
: ensure user, log it, set session,
:)
declare updating function remote-login(
     $remote-user,
     $db,
     $system)
{
 let $exists:=users:find-external($db,$system,$remote-user)
 let $user:=if($exists) then $exists
            else users:generate($db,$remote-user,$system,$remote-user)
 let $action:= if($exists)then "login" else "register"        
return
(
  if($exists) then users:update-stats($db,$user/@id)
              else users:create($db,$user), 
  events:log2($action,$system,$user),
  db:output((session:set("uid", $user),
                 web:redirect("/cellar"))
                )
  )
};

(:~
: get avatar
:)
declare function avatar(
$src-url as xs:string,
$dest-file as xs:string )
{    
    let $r:=  http:send-request(<http:request method='get' />,$src-url)
    return if($r[1]/@status="200") then
             let $type:=$r[1]/http:body/@media-type
             let $is-string:=fn:contains($type,"text") or fn:contains($type,"xml")
             let $p:=if($is-string)
                     then convert:binary-to-string(xs:base64Binary($r[2]))
                     else convert:binary-to-bytes(xs:base64Binary($r[2]))
             let $path:=fn:resolve-uri("pics/users/" || $dest-file)       
             let $junk:=if($is-string)
                        then  file:write-text($path,$p)
                        else  file:write-binary($path,convert:bytes-to-hex($p))
             return ()        
           else ()
 };
 
 (:~
: response msg
:)
declare function rc(
$rc as xs:integer,
$msg as xs:string ) as element(json)
{
   <json  objects="json">
          <rc>{$rc}</rc>
          <msg>{$msg}</msg>
   </json> 
};   