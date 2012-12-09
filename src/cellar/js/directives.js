/*
* Directive that adds a class to a link if the href value of the link matches
* the location.path()
*/

//Syntax allows to chain factories
angular.module('cellar.directives', [])
	.directive('activeLink', ['$location', function(location) {
	    return {
	        restrict: 'A',
	        link: function(scope, element, attrs, controller) {
	            var clazz = attrs.activeLink;
	            var elementPath;
	            //Observe the href value because it is interpolated
	            attrs.$observe('href', function(value) {
					elementPath = value.substring(1);
	            });

            	scope.location = location;
	            scope.$watch('location.path()', function(newPath) {
	                if (elementPath === newPath) {
	                    element.addClass(clazz);
	                } else {
	                    element.removeClass(clazz);
	                }
	            });	

	        }
		};
	}])
	
/**
 * Enhanced Select2 Dropmenus
 * based on: 
 *        https://groups.google.com/forum/?fromgroups=&hl=en#!topic/angular-ui/40TIyjVpSpc
 *        https://groups.google.com/forum/#!topic/angular-ui/7TPv4yoKG98
 */
.directive('apbSelect2', [ '$http', function ( $http) {
  var options = {};
    console.log("apbSelect2  ");
  return {
    require: '?ngModel',
    compile: function (tElm, tAttrs) {
      var watch,
        repeatOption,
		repeatAttr,
        isSelect = tElm.is('select'),
        isMultiple = (tAttrs.multiple !== undefined);

      // Enable watching of the options dataset if in use
      if (tElm.is('select')) {
        repeatOption = tElm.find('option[ng-repeat], option[data-ng-repeat]');
		
        if (repeatOption.length) {
		  repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
          watch = repeatAttr.split('|')[0].trim().split(' ').pop();
        }
      }

      return function (scope, elm, attrs, controller) {
        // instance-specific options
		var xopts={
			placeholder: attrs["placeholder"], 
			allowClear: true,
			multiple:true,
            ajax: {
			    dataType: 'json',
                quietMillis: 100,
                url: attrs["aurl"],
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
				return {results: data.items, more: more};
			}
            },
            formatResult: scope.$eval(attrs.formatresult), // omitted for brevity, see the source of this page
            formatSelection: scope.$eval(attrs.formatselection), // omitted for brevity, see the source of this page 
            dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
        };
        var opts = angular.extend(xopts, options, scope.$eval(attrs.apbSelect2));

        if (isSelect) {
          // Use <select multiple> instead
		   delete opts.ajax;
          delete opts.multiple;
          delete opts.initSelection;
        } else if (isMultiple) {
          opts.multiple = true;
        }

        if (controller) {
          // Watch the model for programmatic changes
          controller.$render = function () {
            if (isSelect) {
              elm.select2('val', controller.$modelValue);
            } else {
              if (isMultiple && !controller.$modelValue) {
                elm.select2('data', []);
              } else {
                elm.select2('data', controller.$modelValue);
              }
            }
          };


          // Watch the options dataset for changes
          if (watch) {
            scope.$watch(watch, function (newVal, oldVal, scope) {
              if (!newVal) return;
              // Delayed so that the options have time to be rendered
              setTimeout(function () {
                elm.select2('val', controller.$viewValue);
                // Refresh angular to remove the superfluous option
                elm.trigger('change');
              });
            });
          }

          if (!isSelect) {
            // Set the view and model value and update the angular template manually for the ajax/multiple select2.
            elm.bind("change", function () {
              scope.$apply(function () {
                controller.$setViewValue(elm.select2('val'));
              });
            });

            if (opts.initSelection) {
              var initSelection = opts.initSelection;
              opts.initSelection = function (element, callback) {
                initSelection(element, function (value) {
                  controller.$setViewValue(value);
                  callback(value);
                });
              };
            }
          }
        }

        attrs.$observe('disabled', function (value) {
          elm.select2(value && 'disable' || 'enable');
        });

        scope.$watch(attrs.ngMultiple, function(newVal) {
          elm.select2(opts);
        });

        // Set initial value since Angular doesn't
        elm.val(scope.$eval(attrs.ngModel));

        // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
        setTimeout(function () {
          elm.select2(opts);
        });
      };
    }
  };
}])
// http://www.smartjava.org/content/drag-and-drop-angularjs-using-jquery-ui
.directive('dndList', function() {
 
    return function(scope, element, attrs) {
 
        // variables used for dnd
        var toUpdate;
        var startIndex = -1;
 
        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(attrs.dndList, function(value) {
            toUpdate = value;
        },true);
 
        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
            },
            stop:function (event, ui) {
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
                toUpdate.splice(startIndex,1);
                toUpdate.splice(newIndex,0,toMove);
 
                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(scope.model);
            },
            Xaxis:'y'
        })
    }
})
.directive('dndBetweenList', function($parse) {
 
    return function(scope, element, attrs) {
 
        // contains the args for this component
        var args = attrs.dndBetweenList.split(',');
        // contains the args for the target
        var targetArgs = $('#'+args[1]).attr('dnd-between-list').split(',');
 
        // variables used for dnd
        var toUpdate;
        var target;
        var startIndex = -1;
        var toTarget = true;
 
        // watch the model, so we always know what element
        // is at a specific position
        scope.$watch(args[0], function(value) {
            toUpdate = value;
        },true);
 
        // also watch for changes in the target list
        scope.$watch(targetArgs[0], function(value) {
            target = value;
        },true);
 
        // use jquery to make the element sortable (dnd). This is called
        // when the element is rendered
        $(element[0]).sortable({
            items:'li',
            start:function (event, ui) {
                // on start we define where the item is dragged from
                startIndex = ($(ui.item).index());
                toTarget = false;
            },
            stop:function (event, ui) {
                var newParent = ui.item[0].parentNode.id;
 
                // on stop we determine the new index of the
                // item and store it there
                var newIndex = ($(ui.item).index());
                var toMove = toUpdate[startIndex];
 
                // we need to remove him from the configured model
                toUpdate.splice(startIndex,1);
 
                if (newParent == args[1]) {
                    // and add it to the linked list
                    target.splice(newIndex,0,toMove);
                }  else {
                    toUpdate.splice(newIndex,0,toMove);
                }
 
                // we move items in the array, if we want
                // to trigger an update in angular use $apply()
                // since we're outside angulars lifecycle
                scope.$apply(targetArgs[0]);
                scope.$apply(args[0]);
            },
            connectWith:'#'+args[1]
        })
    }
});

