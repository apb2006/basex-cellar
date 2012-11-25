(:~ 
: twitter auth  application
: https://dev.twitter.com/docs/auth/implementing-sign-twitter 
: https://dev.twitter.com/discussions/6913
: @author andy bunce
: @since nov 2012
:)
module namespace twitter = 'https://api.twitter.com/oauth/authenticate';
declare default function namespace 'https://api.twitter.com/oauth/authenticate';
declare namespace rest = 'http://exquery.org/ns/restxq';

import module namespace oa="http://basex.org/ns/oauth" at "oauth.xqy";
import module namespace http = 'http://expath.org/ns/http-client';

declare variable $twitter:config:=
                            fn:doc(fn:resolve-uri("../../WEB-INF/cellar-config.xml"))/config                           
                            ;
(:                                                    
let $twitter:CONSUMER-KEY:=$twitter:config/twitter/CONSUMER-KEY
let $twitter:CONSUMER-SECRET:=$twitter:config/twitter/CONSUMER-SECRET

let $twitter:access-token := $twitter:config/twitter/access-token
let $twitter:access-token-secret := $twitter:config/twitter/access-token
:)



(:~
: redirect to twitter authorize
:)
declare function authorize()
{
    let $oauth_token:="??"
    let $url:="https://api.twitter.com/oauth/authenticate" || 
               "?oauth_token=" ||$oauth_token
    return   <rest:response>         
               <http:response status="303" >
                 <http:header name="Location" value="{$url}"/>
               </http:response>                      
           </rest:response>
};

(:~
: user details
: http://developer.github.com/v3/users/#get-the-authenticated-user
:)
declare function user(
  $token as xs:string){
   let $href:="https://api.github.com/user?" || encode-params(map{"access_token":=$token})
   let $user:=http:send-request(<http:request method="get"/>,$href)
   return $user[2]
};

declare function encode-params(
  $map as map(*)) as xs:string
{
    let $s:=for $p in map:keys($map)
            return $p || "=" || fn:encode-for-uri(fn:string(map:get($map,$p)))
    return fn:string-join($s,"&amp;")
}; 