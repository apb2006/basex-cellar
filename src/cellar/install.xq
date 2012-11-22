(: create db :)
let $cellar:=fn:resolve-uri("data/cellar/")
let $user:=fn:resolve-uri("data/users/")
return (
db:output("done"),
db:create("cellar",$cellar),
db:create("users",$user)
)


