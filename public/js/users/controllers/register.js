(function(APP) {
    'use strict';

    var register;

   	register = ['$scope', 'users.auth', '$state',
   		function($scope, auth, $state) {

            $scope.register = function(form) {
                if(form.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                auth.registerUser($scope.user).then(function(response) {

                    setTimeout(function() {
                        $state.go('login');
                    }, 1000);

                }).catch(function(error) {
                    $scope.errorMessage = response.data.message;

                }).finally(function() {
                    $scope.isLoading = false;
                });
            };
    }];

    module.exports = register;
})(window.APP);