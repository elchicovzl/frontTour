(function() {
    'use strict';

    var toastr;

    toastr = require('toastr');

    module.exports = ['$scope','tours.api', '$q', '$stateParams', '$state', '$timeout',
        function($scope, api, $q, $stateParams, $state, $timeout) {

            $scope.panos      = [];
            $scope.images     = [];
            $scope.floorplans = [];

            function haveEdit(elm) {
                return elm.hasOwnProperty('edit');
            }

            $scope.createTour = function(form) {
                var promises;

                promises = [];

                if(form.$invalid) {
                    $scope.isSubmitted = true;

                    return undefined;
                }

                $scope.isLoading = true;

                if($scope.images.length > 0) {  

                    if(!$scope.images[0].hasOwnProperty('edit')) {
                        promises.push(api.images.create({}, {
                            name        : $scope.images[0].name,
                            locationURL : $scope.images[0] && $scope.images[0].id
                        }));
                    }                 
                }

                if($scope.floorplans.length > 0) {

                    if(!$scope.floorplans[0].hasOwnProperty('edit')) {
                        promises.push(api.floorplans.create({}, {
                            name        : $scope.floorplans[0].name,
                            locationURL : $scope.floorplans[0].id
                        }));
                    }
                }

                if($scope.panos.length > 0) {

                    $scope.panos.forEach(function(pano) {

                        if(!pano.hasOwnProperty('edit')) {
                            promises.push(api.panos.create({}, {
                                name        : pano.name,
                                locationURL : pano.id
                            }));
                        }
                    })
                }

                $q.all(promises).then(function(responses) {

                    responses.forEach(function(response) {
                        var typeCall;
            
                        typeCall = response.config.url.substr(5);
                        console.log("");
                        console.log(response);

                        switch(typeCall) {
                            case 'panos':
                                $scope.panos.push({id:response.data.id, edit:false});
                                break;

                            case 'floorplans':
                                $scope.floorplans.push({id:response.data.id, edit:false});
                                break;

                            case 'images':
                                $scope.images.push({id:response.data.id, edit:false});
                                break;
                        }
                    });

                    $scope.tour.pano      = $scope.panos.filter(haveEdit);
                    $scope.tour.floorplan = $scope.floorplans.filter(haveEdit);
                    $scope.tour.image     = $scope.images.filter(haveEdit);

                    api.tours.update({id: $scope.tour.id}, $scope.tour).then(function() {

                        //redirect
                        $state.go('home.myTours');
                    }).catch(function() {

                    }).finally(function() {
                        $scope.isLoading = false;
                        toastr.success('Tour has been updated successfully', 'Success');
                    });
                });
            };

            api.tours.get({id: $stateParams.id}).then(function(response) {
                $scope.tour = response.data;

                $scope.panos = response.data.pano.map(function (obj) {
                    return obj;
                });

                $scope.floorplans = response.data.floorplan.map(function (obj) {
                    return obj;
                }); 

                $scope.images = response.data.image.map(function (obj) {
                    return obj;
                });

                $scope.isDataLoaded = true;

            }).catch(function(response) {

                if(response.status === 404) {
                    toastr.error('Tour was not found', 'Error');

                    $timeout(function() {
                        $state.go('home.myTours');
                    }, 2000);
                }
            });
        }
    ];
})();