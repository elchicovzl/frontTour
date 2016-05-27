(function() {
    'use strict';

    var jquery,
    	_,
    	toastr;

    jquery = require('jquery');
    _      = require('lodash');
    toastr = require('toastr');

    module.exports = ['$scope','tours.api', 'utils.Collection', '$stateParams', '$state',
        function($scope, api, Collection, $stateParams, $state) {
        	var container,
        		tour;

        		$scope.url  = window.api.hostname + "/files/";
        		container   = document.getElementById("view-canvas");
        		tour        = new google.maps.StreetViewPanorama(container);

        		$scope.getTour    = false;
        		$scope.loadedTour = false;

        		_getTour();

                google.maps.event.addListener(tour, 'pano_changed', function() {
                    var text;

                        text = tour.getPano();
                        text = text.replace(/"/g, '');

                    angular.forEach($scope.tour.pano, function(value, key) {

                        if(value.name == text) {
                            $scope.pano = value;
                        }
                    });

                })

        		function initPano() {

        			tour.setPano($scope.pano.name);
        			tour.setVisible(true);
        			tour.registerPanoProvider(getCustomPanorama);
        			
				}

				// Return a pano image given the panoID.
				function getCustomPanoramaTileUrl(pano, zoom, tileX, tileY) {
				 
				  // Note: robust custom panorama methods would require tiled pano data.
				  // Here we're just using a single tile, set to the tile size and equal
				  // to the pano "world" size.
				  return getString($scope.pano.imagePano);
				}

				function getString(str) {
            		return str;
            	}

				// Construct the appropriate StreetViewPanoramaData given
				// the passed pano IDs.
				function getCustomPanorama(pano, zoom, tileX, tileY) {
				    return {
				      location: {
				        pano: pano,
				        description: 'description'
				      },
				      links: $scope.pano.povLinks,
				      // The text for the copyright control.
				      copyright: 'Imagery (c) 2010 Google',
				      // The definition of the tiles for this panorama.
				      tiles: {
				        tileSize: new google.maps.Size(1024, 512),
				        worldSize: new google.maps.Size(1024, 512),
				        // The heading in degrees at the origin of the panorama
				        // tile set.
				        centerHeading: 105,
				        getTileUrl: getCustomPanoramaTileUrl
				      }
				    };
				}

        		function _getTour() {
	                $scope.isDataLoaded = false;

	                api.tours.get ({id:$stateParams.id}).then(function(response) {

	                    $scope.tour = response.data;

	                    angular.forEach($scope.tour.pano, function(value, key) {
	                    	value.imagePano = $scope.url + value.locationURL;
						});

						$scope.pano = $scope.tour.pano[0];

						angular.forEach($scope.tour.floorplan, function(value, key) {
	                    	value.imageFloorplan = $scope.url + value.locationURL;
						});

						$scope.getTour      = true;
						initPano();
	                    $scope.isDataLoaded = true;
	                });
            	}

                $scope.fpChangePano = function (id, pano) {
                    tour.setPano(pano);
                }

            	$scope.$watch('loadedTour', function(newVal) {
            		if(newVal) {
            			setTimeout(function() {
            				google.maps.event.trigger(tour, "resize");
            			}, 1000);
            			
            		}
            	})     	
        }
    ];
})();