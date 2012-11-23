(:~ 
: users rest api
: @author andy bunce
: @since jun 2012
:)

module namespace auth = 'apb.users.app';
declare default function namespace 'apb.users.app';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
import module namespace users = 'apb.users.app' at "user-db.xqm";



import module namespace session ="http://basex.org/modules/session";
declare namespace rest = 'http://exquery.org/ns/restxq';


declare variable $auth:userdb:=db:open('users',"users.xml");							

                           
(:~
: return all users as json if this session is for admin
: auth required
:)
declare
%rest:GET %rest:path("cellar/api/users")  
%output:method("json")
function users()
{
   web:role-check("admin",function(){
       <json arrays="json" objects="user">
		      {for $u in $auth:userdb/users/user
			  order by fn:number($u/stats/@logins) descending
			  return <user>
			      <id>{$u/@id/fn:string()}</id>
				  <name>{$u/name/fn:string()}</name>
				  <created>{$u/stats/@created/fn:string()}</created>
				  <last>{$u/stats/@last/fn:string()}</last>
				  <count>{$u/stats/@logins/fn:string()}</count>
				  </user>}
		</json>}   
)};

(:~
: full details for user with id as json
:)
declare
%rest:GET %rest:path("cellar/api/users/{$id}")  
%output:method("json")
function get-user(
  $id)
{
 <json arrays="json" objects="user">
   <msg>Not yet</msg>
 </json>
}; 