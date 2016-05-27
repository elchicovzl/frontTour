'use strict';

(function() {
    var login,
        toastr;

    toastr = require('toastr');

   	login = ['$scope', 'users.auth', '$state', '$filter',
   		function($scope, auth, $state, $filters) {

            var capitalizeFilter;

            capitalizeFilter = $filters('capitalize');

            $scope.login = function(form) {
                if(form.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                auth.authenticateUser($scope.user).then(function(response) {

                    if(!response.data.user.id) {
                        throw {data:{message: 'Server is not responding correctly'}};
                    }

                    toastr.success('Welcome', 'Success');

                    window.user = response.data.user;

                    setTimeout(function() {
                        $state.go('home.overview');
                    }, 2000);

                }).catch(function(response) {
                    response.isOverrideHandler = true;

                    toastr.error(capitalizeFilter(response.data.message, 'all'), 'Error');

                }).finally(function() {
                    $scope.isLoading = false;
                });
            };

            $scope.registerView = function() {
            	$state.go('/register');
            };

    }];

    module.exports = login;
})();
