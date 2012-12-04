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
}]);

;
;

