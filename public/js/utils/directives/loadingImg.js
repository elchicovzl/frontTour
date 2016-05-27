(function() {
    'use strict';

    module.exports = function() {
        return {
            restrict : 'A',
            link     : function(scope, element, attrs, modelCtrl) {
                var location,
                    downloadingImage,
                    url;

                url = window.api.hostname + "/files";    

                if(attrs.typeimage == 'floorplan') {
                    scope.$watch('tour', function(tour) {

                        if(typeof tour != "undefined") {

                            if(tour.floorplan.length > 0) {

                                location         = url + "/" +tour.floorplan[0].locationURL;
                                element[0].src   = "public/imgs/loading.gif";
                                downloadingImage = new Image();

                                downloadingImage.onload = function() {
                                    element[0].src = this.src;
                                    scope.populateFloorplan(scope.links, element[0]);
                                };

                                downloadingImage.src = location;
                            }else {

                             scope.notFp = true;
                            }                               
                        }
                    });
                }else {
                    //default a image
                    if(scope.tour.image.length > 0) {
                        location = url + "/" + scope.tour.image[0].locationURL;
                    }else {
                        location = "public/imgs/default_tour_cover.jpg"
                    }
                                            
                    element[0].src   = "public/imgs/loading.gif";
                    downloadingImage = new Image();

                    downloadingImage.onload = function() {
                        element[0].src = this.src;   
                    };

                    downloadingImage.src = location;
                } 
            }
        };
    };
})();