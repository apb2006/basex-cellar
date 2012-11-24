(: create db :)
let $cellar:=fn:resolve-uri("data/cellar/")
let $user:=fn:resolve-uri("data/users/")
return (
    if(db:exists("cellar"))then db:drop("cellar") else (),
    db:create("cellar",$cellar),
    
    if(db:exists("users"))then db:drop("users") else (),
    db:create("users",$user),
    
    db:output("done")
)


