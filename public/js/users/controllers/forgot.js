(function(APP) {
    'use strict';

    var forgot,
        toastr;

    toastr = require('toastr');

   	forgot = ['$scope', 'users.auth', '$state',
   		function($scope, auth, $state) {

            $scope.forgot = function(form) {
                if(form.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                auth.forgot($scope.email).then(function(response) {

                    console.log(response);
                    toastr.success(response.data.message, 'Success');

                }).catch(function(error) {
                    $scope.errorMessage = error.data.message;

                }).finally(function() {
                    $scope.isLoading = false;
                });
            };
    }];

    module.exports = forgot;
})(window.APP);