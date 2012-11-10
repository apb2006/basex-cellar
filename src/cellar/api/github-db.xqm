(:~ 
: githubuser db interface
:<github>
:<!-- 
:<user name="github" local="id">
:<meta created=""/>
:</user>
: -->
</github>
: @author andy bunce
: @since nov 2012
:)

module namespace users = 'apb.github.db';
declare default function namespace 'apb.github.db';

declare function find-name($userDb,$username as xs:string)
{
    $userDb/github/user[@name=$username]
};

declare function find-id($userDb,$id as xs:string?) as element(user)?
{
    if($id) then $userDb/users/user[@id=$id] else ()
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
: create new user
:)
declare updating function create($userDb,
                              $name as xs:string,
                              $profile)
{    
     let $d:=<user id="{next-id($userDb)}" name="{$name}">
              {$profile}
        </user>
    return  (insert node $d into $userDb/users ,incr-id($userDb) )
};

