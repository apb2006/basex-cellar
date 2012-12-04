(: create db :)
let $recreate:=false()
let $cellar:=fn:resolve-uri("data/cellar/")
let $user:=fn:resolve-uri("data/users/")
let $mondial:=fn:resolve-uri("data/mondial.zip")
return (
    if($recreate and db:exists("cellar"))then db:drop("cellar") else (),
    db:create("cellar",$cellar),
    
    if($recreate and db:exists("users"))then db:drop("users") else (),
    db:create("users",$user),
	
     if($recreate and db:exists("mondial"))then db:drop("mondial") else (),
    db:create("mondial",$mondial),
	
    db:output("done")
)


