(:~ 
: user db interface
: <user id="1" name="admin">
:    <stats created="2012-08-06T22:29:37.643+01:00" last="2012-11-01T22:17:35.959Z" logins="1"/>
:    <login password="oa2xJp0I39IG1DBdfa4Nzg==" role="admin"/>
:    <data>
:      <ace theme="dawn"/>
:    </data>
:  </user>
: @author andy bunce
: @since jun 2012
:)

module namespace users = 'apb.users.app';
declare default function namespace 'apb.users.app';

declare function find-name($userDb,$username as xs:string)  as element(user)?
{
    $userDb/users/user[@name=$username]
};

declare function find-id($userDb,$id as xs:string?) as element(user)?
{
    if($id) then $userDb/users/user[@id=$id] else ()
};

(:~
: return user with name and password or empty
:)
declare function password-check($userDb,
                                $username as xs:string,
                                $password as xs:string)  as element(user)?
{
    password-check(find-name($userDb,$username),$password)
};

(:~
: return user with name and password or empty
:)
declare function password-check(
    $user as element(user)?,
    $password as xs:string)  as element(user)?
{
    $user[login/@password=hash:md5($password) ]
};

(:~
: change password for user
:)
declare updating function password-change(
    $user as element(user)?,
    $newpassword as xs:string)   
{
    replace value of node $user/login/@password with hash:md5($newpassword) 
};

(:~
: next id
:)
declare function next-id($userDb) as xs:integer
{
    $userDb/users/@nextid
};

(:~
: increment the file id
:)
declare updating function incr-id($userDb)
{
     replace value of node $userDb/users/@nextid with next-id($userDb)+1
};

(:~
: return data to be added to db  if user registers 
:)
declare function generate(
  $userDb,
  $name as xs:string,
  $password as xs:string)
{    
<user id="{next-id($userDb)}" name="{$name}">
	   <stats created="{fn:current-dateTime()}" last="{fn:current-dateTime()}" logins="1" />
	   <login password="{hash:md5($password)}" role="user" />
	   <data>
		 <ace theme="dawn" /> 
	   </data>        
</user>
};

(:~
: insert new user created with generate
:)
declare updating function create($userDb,$u as element(user))
{    
    insert node $u into $userDb/users ,incr-id($userDb) 
};

(:~
: create new user
:)
declare updating function create($userDb,
                              $name as xs:string,
                              $password as xs:string)
{    
    let $d:=generate($userDb, $name ,  $password)   
    return  (insert node $d into $userDb/users ,incr-id($userDb) )
};

(:~
: delete user
:)
declare updating function delete($userDb,
                              $id as xs:string)
{    
   
    delete node $userDb/users/user[@id=$id]
};

(:~
: update login stats
:)
declare updating function update-stats($userDb,$uid as xs:string)                           
{    
    let $d:= $userDb/users/user[@id=$uid]
    return  (replace value of node $d/stats/@last with fn:current-dateTime(),
             replace value of node $d/stats/@logins with 1+$d/stats/@logins)
};