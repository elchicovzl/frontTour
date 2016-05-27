(function() {
    'use strict';

    var toastr;

    toastr = require('toastr');

    module.exports = ['$scope','tours.api', '$q', '$state',
        function($scope, api, $q, $state) {
            
            $scope.panos      = [];
            $scope.images     = [];
            $scope.floorplans = [];
            $scope.isLoading  = false;

        	$scope.createTour = function(form) {
                var promises;

                promises = [];

        		if(form.$invalid) {
                    $scope.isSubmitted = true;

                    return undefined;
                }

                $scope.isLoading = true;

                //make the appropriate calls
                if($scope.images.length > 0) {
                    promises.push(api.images.create({}, {
                        name        : $scope.images[0].name,
                        locationURL : $scope.images[0] && $scope.images[0].id
                    }));
                }

                if($scope.floorplans.length > 0) {
                    promises.push(api.floorplans.create({}, {
                        name        : $scope.floorplans[0].name,
                        locationURL : $scope.floorplans[0].id
                    }));
                }

                if($scope.panos.length > 0) {
                    $scope.panos.forEach(function(pano) {
                        promises.push(api.panos.create({}, {
                            name        : pano.name,
                            locationURL : pano.id
                        }));
                    })
                }

                $q.all(promises).then(function(responses) {

                    $scope.tour.images     = [];
                    $scope.tour.floorplans = [];
                    $scope.tour.panos      = [];

                    responses.forEach(function(response) {
                        var typeCall;

                        typeCall = response.config.url.substr(5);

                        switch(typeCall) {
                            case 'panos':
                                $scope.tour.panos.push(response.data.id);
                                break;

                            case 'floorplans':
                                $scope.tour.floorplans.push(response.data.id);
                                break;

                            case 'images':
                                $scope.tour.images.push(response.data.id);
                                break;
                        }
                    });

                    $scope.tour.user = {id: $scope.user.id};

                    api.tours.create({}, $scope.tour).then(function() {

                        //redirect
                        $state.go('home.myTours');
                    }).catch(function() {

                    }).finally(function() {
                        $scope.isLoading = false;
                    });
                });
        	};
        }
    ];

})();
