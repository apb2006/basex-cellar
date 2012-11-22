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

(:~
: return user element from name or empty
:)
declare function find-user(
   $userDb,
   $github-name as xs:string?) as element(user)?
{
    if($github-name) then $userDb/users/user[@id=$github-name] else ()
};

(:~
: ensure user
:)
declare updating function ensure(
  $userDb,
  $github-name as xs:string,
  $profile)
{    
   let $u:=$userDb/users/user[@id=$github-name]
   return if($u) then
            (replace node $u/* with $profile,
			 replace value of node $u/@modified with fn:current-dateTime())
          else
           let $d:=<user id="{$github-name}" created="{fn:current-dateTime()}" modified="{fn:current-dateTime()}">
                     {$profile}
                   </user>
           return  insert node $d into $userDb/github 
};


(:~
: delete user
:)
declare updating function delete(
    $userDb,
    $name as xs:string)
{    
    delete node $userDb/users/user[@id=$name]
};
