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
                            fn:doc(fn:resolve-uri("../../WEB-INF/cellar-config.xml"))/config/twitter                           
                            ;


(:~
: redirect to twitter authorize
:)
declare function authorize($callback as xs:string?)
{
     let $service-document:=oa:twitter-service($twitter:config/CONSUMER-KEY,$twitter:config/CONSUMER-SECRET)
	 let $request-token:=oa:request-token($service-document,$callback)
	 let $oauth_token:=$request-token/oa:oauth_token/fn:string()
    let $url:="https://api.twitter.com/oauth/authenticate" || 
               "?oauth_token=" ||$oauth_token
    return   <rest:response>         
               <http:response status="303" >
                 <http:header name="Location" value="{$url}"/>
               </http:response>                      
           </rest:response>
};

(:
: return screen_name
:)
declare function login(
  $oauth_token,
  $oauth_verifier)
{
 let $service-document:=oa:twitter-service($twitter:config/CONSUMER-KEY,$twitter:config/CONSUMER-SECRET)
 let $request-token:=<oa:request-token>
					<oa:oauth_token>{$oauth_token}</oa:oauth_token>
					<oa:oaauth_token_secret>{$twitter:config/access-token-secret}</oa:oaauth_token_secret>
					</oa:request-token>
 let $tok:=oa:access-token($service-document,$request-token,$oauth_verifier)
 let $user:=fn:trace($tok/oa:screen_name,":::")
  return fn:trace($user,".....")
};

(:~
: user details
: http://developer.github.com/v3/users/#get-the-authenticated-user
:)
declare function user(
  $token as xs:string){
   let $href:="https://api.twitter.com/1/users/show.json?user_id=?" || encode-params(map{"access_token":=$token})
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