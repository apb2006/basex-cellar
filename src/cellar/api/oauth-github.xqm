(:~ 
: github auth  application 
: @author andy bunce
: @since nov 2012
:)
module namespace github = 'http://developer.github.com/v3/oauth/';
declare default function namespace 'http://developer.github.com/v3/oauth/';
declare namespace rest = 'http://exquery.org/ns/restxq';
import module namespace http = 'http://expath.org/ns/http-client';

declare variable $github:config:=
                            fn:doc(fn:resolve-uri("../../WEB-INF/site-config.xml"))/config                           
                            ;                         
declare variable $github:Client-Id:=$github:config/github/Client-Id;
declare variable $github:Client-Secret:=$github:config/github/Client-Secret;
(:~
: client_id
:    Required string - The client ID you received from GitHub when you registered.
: client_secret
:    Required string - The client secret you received from GitHub when you registered.
:code
:    Required string - The code you received as a response to Step 1.
:state
:    Required string - The state value you provided in Step 1.
: redirect_uri
:    Optional string 
: http://developer.github.com/v3/oauth/
:)
declare function login($code  as xs:string,
                       $redirect_uri  as xs:string){
    let $p:=map{"client_id":=$github:Client-Id,
                "client_secret" := $github:Client-Secret,
                "code":=$code,
                "state":="fish"}
                
    let $request :=
      <http:request href='https://github.com/login/oauth/access_token'
        method='post' >
         <http:header name="Accept" value="application/xml"/>
         <http:body media-type='application/x-www-form-urlencoded'>{encode-params($p)}</http:body>
      </http:request>
    let $r:= fn:trace( http:send-request($request),"github")
    let $access_token:= $r[2]/Oauth/access_token/fn:string()
    let $href:="https://api.github.com/user?" || encode-params(map{"access_token":=$access_token})
    return http:send-request(<http:request method="get"/>,$href)
};

declare function github(){
    let $url:="https://github.com/login/oauth/authorize" || 
               "?client_id=" ||$github:Client-Id ||
               "&amp;state=fish"
    return   <rest:response>         
               <http:response status="303" >
                 <http:header name="Location" value="{$url}"/>
               </http:response>                      
           </rest:response>
};

declare function encode-params($map as map(*)){
    let $s:=for $p in map:keys($map)
            return $p || "=" || fn:escape-html-uri(map:get($map,$p))
    return fn:string-join($s,"&amp;")
}; 