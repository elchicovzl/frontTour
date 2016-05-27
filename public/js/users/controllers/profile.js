(function(APP) {
    'use strict';

    var profile,
        toastr;

    toastr = require('toastr');

   	profile = ['$scope', 'users.auth', '$state', '$stateParams',
   		function($scope, api, $state, $stateParams) {

            $scope.url = window.api.hostname + "/files/"; 

            $scope.directory = "users";
            $scope.flagPass  = false;
            $scope.passwd    = {};
            $scope.edit      = false;
            $scope.avatar    = null;

            $scope.editMode = function() {
                $scope.edit = true;
            }

            $scope.changePasswordOn = function() {
                $scope.flagPass = true;       
            }

            $scope.changePasswordOf = function() {
                $scope.flagPass = false;       
            }

            _getUser();

            function _getUser() {
                $scope.isDataLoaded = false;

                api.getUser({id:$stateParams.id}).then(function(response) {
                    $scope.profile    = response.data;
                    $scope.profile.avatar = response.data.avatar;  
                    $scope.isDataLoaded = true;
                });
            }

            $scope.updateUser = function(form) {

                if(form.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                if($scope.avatar && $scope.avatar.length > 0) {
                    $scope.profile.avatar = $scope.avatar[0].id;
                }

                api.updateUser($scope.profile).then(function(response) {
                    toastr.success('User Update', 'Success');
                    $state.go($state.current, $stateParams, {reload: true, inherit: false});

                }).catch(function(error) {
                    console.log(error);
                    $scope.errorMessage = error.data.message;

                }).finally(function() {
                    $scope.isLoading = false;
                });
            }

            $scope.updatePassword = function(form2) {
                if(form2.$invalid) {
                    $scope.isFormSummitted = true;
                    return;
                }

                $scope.isLoading = true;

                $scope.passwd.id = $scope.profile.id;

                api.updateUser($scope.passwd).then(function(response) {
                    toastr.success('Password Update', 'Success');
                    $state.go($state.current, $stateParams, {reload: true, inherit: false});

                }).catch(function(error) {
                    $scope.errorMessage = error.data.message;

                }).finally(function() {
                    $scope.isLoading = false;
                });
            }
    }];

    module.exports = profile;
})(window.APP);