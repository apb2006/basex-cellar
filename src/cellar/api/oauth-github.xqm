(:~ 
: github auth  application 
: @author andy bunce
: @since nov 2012
:)
module namespace github = 'http://developer.github.com/v3/oauth/';
declare default function namespace 'http://developer.github.com/v3/oauth/';

import module namespace http = 'http://expath.org/ns/http-client';

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
declare function login($client_id as xs:string,
                       $client_secret  as xs:string,
                       $code  as xs:string,
                       $redirect_uri  as xs:string){
    let $p:=map{"client_id":=$client_id,
                "client_secret" := $client_secret,
                "code":=$code,
                "redirect_uri":=$redirect_uri}
                
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

declare function encode-params($map as map(*)){
    let $s:=for $p in $map
            return $p || "=" || fn:escape-html-uri(map:get($map,$p))
    return fn:string-join($s,"&amp;")
}; 