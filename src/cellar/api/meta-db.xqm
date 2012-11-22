(:~ 
: common db tools
: 
: @author andy bunce
: @since nov 2012
:)

module namespace meta-db = 'apb.meta.db';
declare default function namespace 'apb.meta.db';
declare namespace random = 'http://basex.org/modules/random';

(:~
: create a unique id.
:)
declare function generate-id() as xs:string{
  fn:replace(random:uuid(),"-","")
};

(:~
: meta items in output format
:)
declare function output(
  $node)
{(
	<id>{$node/@id/fn:string()}</id>,
	<created>{$node/meta/@created/fn:string()}</created>,
	<modified>{$node/meta/@modified/fn:string()}</modified>
)};

