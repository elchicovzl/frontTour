'use strict';

(function(APP) {

	APP['form.matchPassword'] =  function() {
		return {
		    restrict: 'A',
		    require: ['^ngModel', '^form'],
		    link: function(scope, element, attrs, ctrls) {
			    var formController = ctrls[1];
			    var ngModel = ctrls[0];
			    var otherPasswordModel = formController[attrs.matchPassword];

			    ngModel.$validators.passwordMatch = function(modelValue, viewValue) {
			        var password = modelValue || viewValue;
			        var otherPassword = otherPasswordModel.$modelValue || otherPasswordModel.viewValue;
			        return password === otherPassword;
			    };

		    } // end link
	    }; // end return
	};

	APP['form.spinner'] = function () {
		return {
			restrict: 'E',
			template: '<i class="fa fa-cog fa-spin ng-hide" ng-show="show"></i>',
			scope: {
		      show: '='
		    }
		};
	};

})(window.APP);
