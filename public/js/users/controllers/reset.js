(function(APP) {
    'use strict';

    var reset,
        toastr;

    toastr = require('toastr');

   	reset = ['$scope', 'users.auth', '$state', '$stateParams',
   		function($scope, auth, $state, $stateParams) {

            $scope.isDataLoaded = true;

            _validToken($stateParams.token);

            function _validToken(token) {
                auth.token(token).then(function(response) {
                    console.log(response.data);
                    $scope.user = response.data;
                    $scope.isDataLoaded = false;

                }).catch(function(error) {

                    $scope.errorMessage = error.data.message;

                    setTimeout(function() {
                        $state.go('forgot');
                    }, 1000);
                    

                }).finally(function() {
                    $scope.isLoading = false;
                });
            };

            $scope.reset = function(form) {
                if(form.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                auth.reset($scope.user).then(function(response) {

                    console.log(response);
                    toastr.success(response.data.message, 'Success');
                    setTimeout(function() {
                        $state.go('login');
                    }, 1000);

                }).catch(function(error) {
                    $scope.errorMessage = error.data.message;

                }).finally(function() {
                    $scope.isLoading = false;
                });
            };
    }];

    module.exports = reset;
})(window.APP);