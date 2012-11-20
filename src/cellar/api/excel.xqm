(:~ 
: excel tools
: @author andy bunce
: @since jun 2012
:)

module namespace auth = 'apb.excel';
declare default function namespace 'apb.excel';
declare function export($items){
<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
    <ss:Worksheet ss:Name="Sheet1">
        <ss:Table>
         <ss:Column ss:Width="80"/>
            <ss:Column ss:Width="80"/>
            <ss:Column ss:Width="80"/>
        (: header :)
          <ss:Row>
        { for $f in $items[1]/*
        return 
        <ss:Cell>
           <ss:Data ss:Type="String">local-name($f)</ss:Data>
        </ss:Cell>}
        </ss:Row>   
        (: rest :)
        { for $s in $items
        return
          <ss:Row>
          { for $f in $s
            return
        <ss:Cell>
           <ss:Data ss:Type="String">string($f)</ss:Data>
        </ss:Cell>}
        </ss:Row>
        }   
         </ss:Table> 
         </ss:Worksheet >
 </ss:Workbook>
};