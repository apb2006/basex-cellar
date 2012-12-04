(:
: 
:)

module namespace mondial = 'http://www.dbis.informatik.uni-goettingen.de/Mondial/';
declare default function namespace 'http://www.dbis.informatik.uni-goettingen.de/Mondial/';
declare namespace rest = 'http://exquery.org/ns/restxq';
declare variable $mondial:countries:=db:open("mondial","mondial.xml")/mondial/country;

(:~
: return name and id for all wines as json
:)
declare
%rest:GET %rest:path("cellar/api/countries")  
%output:method("json")
function countries()
{
  <json arrays="json" objects="country">
    {for $country in $mondial:countries
    order by fn:upper-case($country/name)
    return <country>{(
      $country/name
       )}</country>}
  </json>
};


