(function() {
    'use strict';

    var myTours,
        toastr,
        Clipboard;
    

    toastr    = require('toastr');
    Clipboard = require('clipboard');

    myTours = ['$scope','tours.api', 'utils.Collection', '$location',
        function($scope, api, Collection, $location) {
            var filters,
                toursCollection,
                hostname;
                
            $scope.hostname = $location.host() + ':' +  $location.port();    

            filters = {
                page: 1,
                pageLimit: 100
            };

            _getTours();

            $scope.clipboard = function() {
                var clipboard;

                clipboard = new Clipboard('.sharess');

                clipboard.on('success', function(e) {
                    e.clearSelection();
                    toastr.success('link copied to the clipboard', 'Link copied!');
                    clipboard.destroy();
                });
            };

            $scope.loadMore = function() {
                _getTours();
            };

            $scope.deleteTour = function(tour) {
                var deletedTour,
                    indexDeleteTour;

                indexDeleteTour = toursCollection.getIndexBy('id', tour.id);
                deletedTour     = toursCollection.removeBy('id', tour.id);

                api.tours.remove({id: tour.id}).catch(function() {
                    toursCollection.add(deletedTour, indexDeleteTour);
                    toastr.error('Cannot delete the tour', 'Error');
                });
            };

            function _getTours() {
                $scope.isDataLoaded = false;

                api.tours.get(filters).then(function(response) {
                    var tours;

                    tours = response.data._embedded.tours;

                    if(filters.page === 1) {
                        $scope.tours = tours;
                        toursCollection = new Collection($scope.tours);
                    } else {
                        toursCollection.add(tours);
                    }

                    filters.page += 1;
                    $scope.isDataLoaded = true;
                });
            }
        }
    ];

    module.exports = myTours;
})();
