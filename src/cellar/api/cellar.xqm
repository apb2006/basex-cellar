(:~ 
: wine cellar rest api
: @author andy bunce
: @since oct 2012
:)

module namespace cellar = 'apb.cellar.rest';
declare default function namespace 'apb.cellar.rest';

import module namespace web = 'apb.web.utils2' at "webutils.xqm";
declare namespace rest = 'http://exquery.org/ns/restxq';
declare namespace random = 'http://basex.org/modules/random';

declare variable $cellar:wines:=db:open("cellar","wines.xml")/wines;
declare variable $cellar:grapes:=db:open("cellar","grapes.xml")/grapes;  
declare variable $cellar:baseuri:="/restxq/cellar/api/wines/";

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
       <created>{$wine/meta/@created/fn:string()}</created>
	   <modified>{$wine/meta/@modified/fn:string()}</modified>
       {($wine/name,
       $wine/year,
       $wine/grapes,
       $wine/region,
       $wine/country,
       $wine/picture)}
       </wine>}
  </json>
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
    let $new:=<wine id="{$id}"><meta created="{fn:current-dateTime()}"/>{$items }</wine>
    return ( insert node $new into $cellar:wines ,
            db:output(
			  (web:http-created($cellar:baseuri || $id,
			     <json objects="json">{$new/* except $new/meta}</json>))
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
                    <created>{$wine/meta/@created/fn:string()}</created>
                    <modified>{$wine/meta/@modified/fn:string()}</modified>
                    {$wine/* except $wine/meta}
                </json>
			else 
				web:status(404,"Not found: " || $id)	
};

(:~
: full details for wines with id as json
:)
declare
%rest:GET %rest:path("cellar/api/search")
%rest:query-param("q", "{$q}")  
%output:method("json")
function search($q as xs:string){
let $res:=for $wine in $cellar:wines/wine 
let score $s:= $wine/description contains text ({$q} weight{1}) 
						  or  $wine/name contains text ({$q} weight{4}) using fuzzy
			   where $s gt 0           
			   order by $s descending
			   return  <hit><score>{fn:round(20 * $s)}</score>
			                {$wine/name}
                  </hit>							
return <json arrays="json" objects="hit">{$res}</json>
};
(:~
: update details for wine with id
: @modified timestamp used to detect lost update errors
:)
declare
%rest:PUT("{$body}") %rest:path("cellar/api/wines/{$id}")  
%output:method("json")
updating function put-wine($id,$body) { 
  let $old:=$cellar:wines/wine[@id=$id]
  return if($old) then
           let $items:=fn:trace($body/json,"put")
           let $new:=  <wine id="{$old/@id}">
                        <meta created="{$old/meta/@created}"
                        modified="{fn:current-dateTime()}"/>
                        {$items/* except ($items/modified, $items/created,$items/id)} 
                        </wine>
           return              
               if($items/modified=$old/meta/@modified/fn:string() or fn:not($old/meta/@modified))
               then (replace node $old with $new, db:output($body))
               else db:output( web:status(403,"data modified"))
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
: return name and id for all grapes as json
:)
declare
%rest:GET %rest:path("cellar/api/grapes")  
%output:method("json")
function grapes() {
  <json arrays="json" objects="grape">
    {for $grape in $cellar:grapes/grape
    order by fn:upper-case($grape/name)
    return <grape>
       <id>{$grape/@id/fn:string()}</id>
       <created>{$grape/meta/@created/fn:string()}</created>
       {$grape/name,
       $grape/description}
       </grape>}
  </json>
};

(:~
: return xml source
:)
declare
%rest:GET %rest:path("cellar/api/xml") 
%restxq:query-param("doc", "{$doc}") 
%output:method("xml")
function xml($doc) {
  db:open("cellar",$doc)
};

(:~
: create a unique id.
:)
declare function generate-id() as xs:string{
  fn:replace(random:uuid(),"-","")
};