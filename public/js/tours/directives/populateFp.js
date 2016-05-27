(function() {
    'use strict';

    var jquery;

    jquery = require('jquery');

    module.exports = ['utils.Collection',
        function(Collection) {
            return {
                restrict    : 'A',
                link  : function(scope, el, attrs) {
                    var location,
                        downloadingImage;

                    scope.$watch('loadedTour', function(flag) {
                        if(flag && typeof scope.tour != "undefined" && scope.tour.floorplan.length > 0) {

                            location         = window.api.hostname +  "/files/" + scope.tour.floorplan[0].locationURL;
                            // el[0].src        = "public/imgs/loading.gif";
                            downloadingImage = new Image();

                            downloadingImage.onload = function() {
                                el[0].src = this.src;

                                angular.forEach(scope.tour.floorplan[0].links, function(obj) {
                                    var elm,
                                        img,
                                        fpCssLeft,
                                        fpCssTop,
                                        elmLeft,
                                        elmTop,
                                        percentL,
                                        percentT;

                                    fpCssLeft = parseInt(jquery("#floorplan").css("left"));
                                    fpCssTop  = parseInt(jquery("#floorplan").css("top"));
                                   
                                    //calculate px of position in actual img based on percent stored.
                                    percentL = (parseInt(obj.percentPos.left) * jquery("#floorplan").width()) / 100;
                                    percentT = (parseInt(obj.percentPos.top) * jquery("#floorplan").height()) / 100;
                                    
                                    //verify if floorplan have a css in left, top position. 
                                    elmLeft = isNaN(fpCssLeft) ? percentL : fpCssLeft + percentL;
                                    elmTop  = isNaN(fpCssTop)  ? percentT  : fpCssTop  + percentT;

                                    img = document.getElementById('floorplan');
                                    
                                    elm = document.createElement("i");
                                    elm.setAttribute("id", obj.idLink);
                                    elm.classList.add("fa");
                                    elm.classList.add("fa-camera");
                                    elm.style.position = "absolute";
                                    elm.style.zIndex   = "1";
                                    elm.style.top      = elmTop  + "px";
                                    elm.style.left     = elmLeft + "px";
                                    elm.style.cursor   = "pointer"; 

                                    img.parentNode.insertBefore(elm, img);

                                    jquery("#"+obj.idLink).on("click", function(event) {
                                        scope.fpChangePano(obj.idLink, obj.panoName);
                                        scope.$apply();
                                   })
                                });
                            };

                            downloadingImage.src = location;
                        }

                    }, true);
                }
            };
        }
    ]
})();