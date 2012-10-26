(:~ 
: wine cellar rest api
: @author andy bunce
: @since oct 2012
:)

module namespace cellar = 'apb.cellar.rest';
declare default function namespace 'apb.cellar.rest';
import module namespace web = 'apb.web.utils2' at "webutils.xqm";

declare namespace rest = 'http://exquery.org/ns/restxq';

declare variable $cellar:wines:=db:open("cellar","wine.xml")/wines; 
declare variable $cellar:baseuri:="http://localhost:8984/restxq/cellar/api/wines/";

(:~
: return name and id for all wines as json
:)
declare
%rest:GET %rest:path("cellar/api/wines")  
%output:method("json")
function wines() {
  <json arrays="json" objects="wine">
    {for $wine in $cellar:wines/wine
    order by fn:upper-case($wine/name)
    return <wine>
       <id>{$wine/@id/fn:string()}</id>
       <created>{$wine/@created/fn:string()}</created>
       {($wine/name,$wine/year,$wine/grapes,$wine/picture)}
       </wine>}
  </json>
};

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
: add a wine
:)
declare
%rest:path("cellar/api/wines")
%rest:POST("{$body}")  
%output:method("json")
updating function add-wine($body) {
    let $items:= $body/json/*
	let $id:=generate-id()
    let $new:=<wine id="{$id}" created="{fn:current-dateTime()}">{$items }</wine>
    return ( insert node $new into $cellar:wines ,
            db:output(
			  (web:http-created($cellar:baseuri || $id,<json objects="json">{$new/*}</json>))
			  )
            )
};

(:~
: default properties for a new wine 
:)
declare
%rest:GET %rest:path("cellar/api/wines/add")  
%output:method("json")
function wine-defaults() {
    <json  objects="json">
    <country>France</country>
    </json>
};

(:~
: full details for wines with id as json
:)
declare
%rest:GET %rest:path("cellar/api/wines/{$id}")  
%output:method("json")
function get-wine($id) {
    let $wine:=$cellar:wines/wine[@id=$id]
    return if($wine) then
				<json  objects="json " numbers="year" >
                    <id>{$wine/@id/fn:string()}</id>
                    <changed>{$wine/@changed/fn:string()}</changed>
                    {$wine/*}
                </json>
			else 
				web:status(404,"Not found: " || $id)	
};

(:~
: update details for wine with id
: @changed timestamp used to detect lost update errors
:)
declare
%rest:PUT("{$body}") %rest:path("cellar/api/wines/{$id}")  
%output:method("json")
updating function put-wine($id,$body) { 
  let $old:=$cellar:wines/wine[@id=$id]
  return if($old) then
           let $items:=fn:trace($body/json,"put")
           let $new:=  <wine id="{$old/@id}" changed="{fn:current-dateTime()}">
                        {$items/* except $items/changed,$items/id} 
                        </wine>
           return              
               if($items/changed=$old/@changed/fn:string() or fn:not($old/@changed))
               then (replace node $old with $new, db:output($body))
               else db:output( web:status(403,"data changed"))
         else 
			db:output(web:status(404,"Not found: " || $id))
};

(:~
:  delete wine with id
:)
declare
%rest:DELETE %rest:path("cellar/api/wines/{$id}")  
%output:method("json")
updating function delete-wine($id) {
  let $wine:=$cellar:wines/wine[@id=$id]
  return if($wine)
         then let $w:= <json  objects="json ">
                        <deleted>true</deleted>
                        </json>
              return (delete node  $wine,db:output($w))
         else db:output(web:status(404,"Not found: " || $id))
};

(:~
: create a unique id.
:)
declare function generate-id() as xs:string{
  random:uuid()
};