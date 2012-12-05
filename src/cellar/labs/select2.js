$(document).ready(function() { 
$("#e1").select2({ 
placeholder: "Select Grape types", 
allowClear: true,
multiple:true,
width:"30em",
 ajax: {
url: "../restxq/cellar/api/grapes",
dataType: 'json',
quietMillis: 100,
data: function (term, page) { // page is the one-based page number tracked by Select2
return {
q: term, //search term
limit: 10, // page size
start: 10*page-9, // page number
};
},
results: function (data, page) {
var more = (page * 10) < data.total; // whether or not there are more results available
 
// notice we return the value of more so Select2 knows if more results can be loaded
return {results: data.grapes, more: more};

}},
 formatResult: grapeFormatResult, // omitted for brevity, see the source of this page
formatSelection: grapeFormatSelection, // omitted for brevity, see the source of this page 
dropdownCssClass: "bigdrop"}
     );
function grapeFormatResult(grape){
return "<div>"+grape.name+"</div>"
};
function grapeFormatSelection(grape){
 return "<span style='background-color:yellow'>"+grape.name+"</span>"
};	 	 
	 });