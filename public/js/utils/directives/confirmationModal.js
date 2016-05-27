/**
 * @ngdoc directive
 * @name confirmationModal
 * @scope
 * @restrict A
 *
 * @description Directive that creates a modal to confirm a specific action.
 *
 * @param {expresion} action  - Expression to be evaluate if user clicks accepts.
 * @param {string}    message - Message to override the one in the template.
 */

(function() {
    "use strict";

    module.exports = ['utils.modal', function(blurModal) {

        var confirmationModal;

        confirmationModal = blurModal({
            templateUrl : '/public/views/utils/confirmationModal.html',
            scope       : {},
            controller  : function($scope) {
                $scope.message = $scope.message || 'Do you really want to perform this action?';

                $scope.accept = function() {
                    if(typeof $scope.action !== 'function') {
                        throw {
                            message: 'The directive confirmation-modal needs an "action" attribute'
                        };
                    }

                    $scope.action();
                    $scope.$close();
                }
            }
        });

        return  {
            restrict: 'A',
            scope: {
                action  : '&',
                message : '='
            },

            link: function($scope, element) {
                element.on('click', function() {
                    confirmationModal.open({
                        action  : $scope.action,
                        message : $scope.message
                    });
                });
            }
        };
    }];
})();


