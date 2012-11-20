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



declare function find-user($userDb,$name as xs:string?) as element(user)?
{
    if($name) then $userDb/users/user[@id=$name] else ()
};

(:~
: ensure user
:)
declare updating function ensure($userDb,
                              $name as xs:string,
                              $profile)
{    
   let $u:=$userDb/users/user[@id=$name]
   return if($u) then
            replace node $u/* with $profile
          else
           let $d:=<user id="{$name}" created="{fn:current-dateTime()}">
                     {$profile}
                   </user>
           return  insert node $d into $userDb/github 
};


(:~
: delete user
:)
declare updating function delete($userDb,
                              $name as xs:string)
{    
    delete node $userDb/users/user[@id=$name]
};
