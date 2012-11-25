xquery version "3.0";
(:~ 
:  event log
: @author andy bunce
: @since nov 2012
:)

module namespace event = 'apb.cellar.event';
declare default function namespace 'apb.cellar.event';
import module namespace session ="http://basex.org/modules/session";

declare variable $event:events:=db:open('cellar',"events.xml")/events;


(:~
: save an event
:)
declare updating function log2(
  $event as xs:string,
  $item as xs:string?
  ){ 
    let $uid:=session:get("uid")    
    let $user:=if($uid) 
                then $uid
                else <user id="0"><name>guest</name></user>
    
    return  log2($event,$item,$user)
};
(:~
: save an event
:)
declare updating function log2(
  $event as xs:string,
  $item as xs:string?,
  $u as element(user)
  ){    
     let $d:=<event userid="{$u/@id/fn:string()}"
              username="{$u/name/fn:string()}" 
              created="{fn:current-dateTime()}" 
              event="{$event}" item="{$item}"/>     
    return  insert node $d  as first into $event:events
};

declare  function list(
){
<json arrays="json" objects="event">
    {for $event in $event:events/event
    return <event>
    <userid>{$event/@userid/fn:string()}</userid> 
    <username>{$event/@username/fn:string()}</username>
    <eventname>{$event/@event/fn:string()}</eventname>
    <created>{$event/@created/fn:string()}</created>
    <item>{$event/@item/fn:string()}</item>
    </event>}
  </json>
  };