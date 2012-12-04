(:
: send emails using the mailgun api
: based http://documentation.mailgun.net/
: curl -s -k --user api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0 \
:curl -s -k --user api:key-3ax6xnjp29jd6fds4gc373sgvjxteol0 \
:    https://api.mailgun.net/v2/samples.mailgun.org/messages \
:    -F from='Excited User <me@samples.mailgun.org>' \
:    -F to=serobnic@mail.ru\
:    -F to=sergeyo@profista.com \
:    -F subject='Hello' \
:    -F text='Testing some Mailgun awesomness!'
: @related https://docs.marklogic.com/xdmp:email
:)

module namespace mailgun = 'https://api.mailgun.net/v2';
declare default function namespace 'https://api.mailgun.net/v2';
import module namespace  http = "http://expath.org/ns/http-client";

declare variable $mailgun:config:=
                            fn:doc(fn:resolve-uri("../../WEB-INF/cellar-config.xml"))/config/mailgun                           
                            ;

declare function send($to as xs:string){
 let $f:=map{
	 "from":="Andy (XQuery) Bunce <xquery@cellarxq.mailgun.org>",
	 "to":=$to,
	 "subject":="test",
	 "text":="'Testing some Mailgun awesomness!" 
	 }
 let $s:=encode-params($f)
 let $password:="key-3ax6xnjp29jd6fds4gc373sgvjxteol0"
 let $r:=<http:request href="https://api.mailgun.net/v2/samples.mailgun.org/messages" method='post' 
             username="api" password="{ $password }" auth-method="basic"    send-authorization="true">
           <http:body media-type="application/x-www-form-urlencoded" method="text">{$s}</http:body> 
         </http:request>
 return http:send-request($r)
};

declare function encode-params(
  $map as map(*)) as xs:string
{
    let $s:=for $p in map:keys($map)
            return $p || "=" || fn:encode-for-uri(fn:string(map:get($map,$p)))
    return fn:string-join($s,"&amp;")
}; 