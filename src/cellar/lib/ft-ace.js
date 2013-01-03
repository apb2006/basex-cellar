/*global angular, CodeMirror, Error*/
/**
 * Binds a CodeMirror widget to a <textarea> element.
 */

//TODO handle Could not load worker ace.js:1
//DOMException {message: "SECURITY_ERR: DOM Exception 18", name: "SECURITY_ERR", code: 18, stack: "Error: An attempt was made to break through the se…cloudfront.net/src-min-noconflict/ace.js:1:76296)", INDEX_SIZE_ERR: 1…}
angular.module('ui.directives').directive('uiAce', ['ui.config', function(uiConfig) {
	if (angular.isUndefined(window.ace)) throw new Error('ui-ace need ace to work... (oh really?)');
	return {
		restrict: 'EA',
		require: '?ngModel',
		link: function(scope, elm, attrs, ngModel) {
			var options, opts, acee, session, onChange;      

			options = uiConfig.uiAce || {};
			opts = {
				theme : attrs.theme,
				mode : attrs.mode,
				onChange : scope.$eval(attrs.onchange)
			};

			//TODO Generalize it.
			if (angular.isDefined(attrs.showGutter))
				opts.showGutter = (angular.isDefined(scope.$eval(attrs.showGutter))) ? scope.$eval(attrs.showGutter) : true;
			if (angular.isDefined(attrs.useWrapMode))
				opts.useWrapMode = (angular.isDefined(scope.$eval(attrs.useWrapMode))) ? scope.$eval(attrs.useWrapMode) : true;

			opts = angular.extend({}, options, opts);

			acee = ace.edit(elm[0]);
			session = acee.getSession();
			onChange = function(callback){
				return function(e) {
					if (angular.isDefined(ngModel)){
						var newValue = session.getValue();
						if (newValue !== scope.$eval(attrs.value) && !scope.$$phase){
							scope.$apply(function(){
								ngModel.$setViewValue(newValue);
								if (angular.isFunction(callback))
									callback(e, acee);
							});
						}
					}else if (!scope.$$phase){
						scope.$apply( function(){
							if (angular.isFunction(callback))
								callback(e, acee);
						});
					}
				};
			};


			//TODO Generalize it. 
			// Boolean options
			if (angular.isDefined(opts.showGutter))
				acee.renderer.setShowGutter(opts.showGutter);
			if (angular.isDefined(opts.useWrapMode))
				session.setUseWrapMode(opts.useWrapMode);

			// Basic options
			if (angular.isString(opts.theme))
				acee.setTheme("ace/theme/" + opts.theme);
			if (angular.isString(opts.mode))
				session.setMode("ace/mode/" + opts.mode);


			// Value Blind
			if (angular.isDefined(ngModel)){
				ngModel.$formatters.push(function(value) {
					if (angular.isUndefined(value) || value === null) {
						return '';
					}
					else if (angular.isObject(value) || angular.isArray(value)) {
						throw new Error('ui-ace cannot use an object or an array as a model');
					}
					return value;
				});

				ngModel.$render = function() {
					session.setValue(ngModel.$viewValue);
				};
			}

			// EVENTS
			session.on('change', onChange(opts.onChange));
		}
	};
}]);