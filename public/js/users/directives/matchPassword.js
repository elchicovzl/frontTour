(function() {
    'use strict';

    var matchPassword;

    matchPassword = function() {
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

    module.exports = matchPassword;
})();