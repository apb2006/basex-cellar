xquery version "3.0";
(:~ 
:  events
: @author andy bunce
: @since aug 2012
:)

module namespace event = 'apb.cellar.event';
declare default function namespace 'apb.cellar.event';

declare variable $event:events:=db:open('cellar',"events.xml")/events;
(:~
: save an event
:)
declare updating function log(
  $event as xs:string,
  $userid as xs:string,
  $username as xs:string,
  $item as xs:string?
  ){    
     let $d:=<event userid="{$userid}" username="{$username}" created="{fn:current-dateTime()}" 
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