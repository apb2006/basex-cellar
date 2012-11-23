xquery version "3.0";
(:~ 
:  events
: @author andy bunce
: @since aug 2012
:)

module namespace event = 'apb.xqwebdoc.event';
declare default function namespace 'apb.xqwebdoc.event';

declare variable $event:events:=db:open('cellar',"events.xml")/events;
(:~
: save xq
:)
declare updating function create($user as xs:string,$event as xs:string,$item as xs:string?){    
     let $d:=<event user="{$user}" time="{fn:current-dateTime()}" 
              event="{$event}" item="{$item}"/>
      
    return  insert node $d into $event:events
};