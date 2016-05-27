(function() {
    'use strict';

    var jquery,
        _,
        toastr;

    jquery = require('jquery');
    _      = require('lodash');
    toastr = require('toastr');


    module.exports = ['$scope','tours.api', 'utils.Collection', 'FileUploader', '$stateParams', '$state', 'tours.Tour',
        function($scope, api, Collection, FileUploader, $stateParams, $state, Tour) {
            var containerPOV,
                panoramaPOV,
                tour;

                $scope.url           = window.api.hostname +  "/files/";
                $scope.links         = [];
                $scope.camSelect     = false;
                $scope.editCamSelect = false;
                $scope.notFp         = false;

                _getTour();

                tour = new Tour();

                //find position of the floorplan img in the page
                function findPosition(element) {
                    var posX,
                        posY;

                    if(typeof( element.offsetParent ) != "undefined") {
                        
                        for(posX = 0, posY = 0; element; element = element.offsetParent) {
                            posX += element.offsetLeft;
                            posY += element.offsetTop;
                        }

                        return [ posX, posY ];
                    } else {
                        return [ element.x, element.y ];
                    }
                }

                // create a element to link panos
                function createCameraLink(imgElm, position, id) {
                    var cam;

                    cam = document.createElement("i");
                    cam.setAttribute("id", id);
                    cam.classList.add("fa");
                    cam.classList.add("fa-camera");
                    cam.style.position = "absolute";
                    cam.style.zIndex   = "1";
                    cam.style.top      = parseInt(position.top)  + "px";
                    cam.style.left     = parseInt(position.left) + "px";
                    cam.style.cursor   = "pointer";

                    imgElm.parentNode.insertBefore(cam, imgElm);

                   jquery("#"+id).on("click", function(event) {
                        $scope.linkInfo(id);
                        $scope.$apply();
                   })

                }

                $scope.populateFloorplan = function(l, elm) {

                    angular.forEach(l, function(obj) {
                        createCameraLink(elm, obj.position, obj.idLink);

                        angular.forEach($scope.panos, function(value) {
                            if(obj.pano == value.id) {
                                value.link = false;
                            }
                        })
                    });
                }

                //get coordinate inside of image 
                $scope.getCordinate = function(e) {
                    var posX,
                        posY,
                        imgPos,
                        elm,
                        position,
                        id;

                    elm    = e.target;
                    imgPos = findPosition(elm);

                    if (e.pageX || e.pageY) {
                        posX = e.pageX;
                        posY = e.pageY;
                    }

                    posX = posX - imgPos[0];
                    posY = posY - imgPos[1];

                    position = {
                        top  : posY,
                        left : posX 
                    }

                    id = tour.generateUUID();

                    $scope.links.push({
                        position : position,
                        idLink       : id,
                        pano     : null,
                        panoName : null
                    })   

                    createCameraLink(elm, position, id);
                    $scope.linkInfo(id);
                }

                $scope.linkInfo = function(id) {
                    var edit;

                    edit          = false;
                    $scope.idLink = id;
                    
                    angular.forEach($scope.links, function(obj) {

                        if (obj.idLink == id && obj.pano != null) {

                            edit        = true;
                            $scope.dataEdit = obj;
                        }
                    })

                    if(edit) {

                        $scope.camSelect     = false;
                        $scope.editCamSelect = true;
                    }else {

                        $scope.editCamSelect = false;
                        $scope.camSelect     = true;
                    }
                }

                $scope.saveLink = function(id) {

                    angular.forEach($scope.links, function(obj) {
                        
                        if(obj.idLink == id) {
                            obj.pano     = $scope.pano.id;
                            obj.panoName = $scope.pano.name; 
                        }
                    })

                    $scope.pano.link = false;
                    $scope.camSelect = false;
                }

                $scope.removeLink = function(id) {
                    var panoId;

                    angular.forEach($scope.links, function(obj) {
                        
                        if(obj.idLink == id) {
                            panoId       = obj.pano;
                            obj.pano     = null;
                            obj.panoName = null; 
                        }
                    });

                    angular.forEach($scope.panos, function(obj) {

                        if(obj.id == panoId) {
                            obj.link = true;
                        }
                    })

                    $scope.editCamSelect = false;
                }

                $scope.deleteLink = function(id) {

                    angular.forEach($scope.links, function(obj, index) {
                        
                        if(obj.idLink == id) {
                            $scope.links.splice(index, 1);
                            jquery("#"+id).remove(); 
                        }
                    });

                    $scope.camSelect = false;
                }

                $scope.cancelLink = function() {
                    $scope.camSelect = false;
                    $scope.editCamSelect = false;
                }

                function _getTour() {
                    $scope.isDataLoaded = false;

                    api.tours.get ({id:$stateParams.id}).then(function(response) {

                        $scope.tour = response.data;

                        angular.forEach($scope.tour.pano, function(value, key) {
                            value.imagePano = $scope.url + value.locationURL;
                        });

                        $scope.panos = $scope.tour.pano.map(function(obj) {
                            obj.link = true;
                            return obj;
                        });

                        if($scope.tour.floorplan.length > 0 && $scope.tour.floorplan[0].links.length > 0) {

                            angular.forEach($scope.tour.floorplan[0].links, function(link) {
                                $scope.links.push(link);
                            });

                            if(typeof $scope.tour.floorplan[0].status != "undefined") {
                                $scope.status = $scope.tour.floorplan[0].status;
                            }
                        }

                        angular.forEach($scope.tour.floorplan, function(value, key) {
                            value.imageFloorplan = $scope.url + value.locationURL;
                        });

                        $scope.isDataLoaded = true;
                    });
                }

                $scope.create = function() {
                    var data;
                    
                    $scope.isLoading = true;

                    data = {
                        links  : $scope.links,
                        status : $scope.status
                    }

                    api.floorplans.update({id:$scope.tour.floorplan[0].id}, data).then(function() {
                        $scope.tour.floorplan[0].links = $scope.links;
                        toastr.success('Tour link create successfully', 'Success');
                        api.flushCache();

                    }).catch(function(err) {
                        console.log(err);
                    }).finally(function() {
                        $scope.isLoading = false;
                    });

                }   
        }
    ];
})();