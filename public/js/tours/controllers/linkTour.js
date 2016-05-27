(function() {
    'use strict';

    var jquery,
    	_,
    	toastr,
        lightslider;

    jquery = require('jquery');
    _      = require('lodash');
    toastr = require('toastr');
    lightslider = require('lightslider')

    module.exports = ['$scope','tours.api', 'utils.Collection', 'FileUploader', '$stateParams', '$state', 'tours.Tour', '$q',
        function($scope, api, Collection, FileUploader, $stateParams, $state, Tour, $q) {
        	var url,
        		containerPOV,
        		panoramaPOV,
                tour;

        		$scope.url         = window.api.hostname + "/files/";
        		containerPOV       = document.getElementById("pov-canvas");
        		panoramaPOV        = new google.maps.StreetViewPanorama(containerPOV);
        		$scope.panoChange  = true;

                $scope.getTour    = false;
                $scope.loadedTour = false;
                $scope.empty      = false;
                $scope.links      = [];
                $scope.pov        = {};
                $scope.slideLoad  = false;
                $scope.imgId      = "";
                $scope.ploaded    = 0;

                tour = new Tour();

        		_getTour();

        		google.maps.event.addListener(panoramaPOV, 'pov_changed', function() {
        			$scope.heading     = parseFloat(panoramaPOV.getPov().heading);
                    $scope.pov.heading = parseFloat(panoramaPOV.getPov().heading);
                    $scope.$apply();
		        });

		        google.maps.event.addListener(panoramaPOV, 'pano_changed', function() {
		            var text;

		           		text = panoramaPOV.getPano();
		            	text = text.replace(/"/g, '');
		            
		            angular.forEach($scope.tour.pano, function(value, key) {

	            		if(value.name == text) {
	            			$scope.pano = value;

	            		}
					});
		        })

        		function _initPano() {
                    if(typeof $scope.pano != "undefined") {
                        panoramaPOV.setPano($scope.pano.name);
                        panoramaPOV.setVisible(true);
                        panoramaPOV.registerPanoProvider(getCustomPanorama);
                        $scope.imgId = $scope.pano.id; 
                    }
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

                        if($scope.tour.pano.length == 0) {
                            $state.go('home.myTours');
                            toastr.warning('Not pano available upload one.', 'Warning');
                        }

	                    angular.forEach($scope.tour.pano, function(value, key) {
	                    	value.imagePano = $scope.url + value.locationURL;
						});
                        
						$scope.pano = $scope.tour.pano[0];

                        if($scope.tour.floorplan.length > 0 ) {

                            if(typeof $scope.tour.floorplan[0].status != "undefined") {
                                $scope.status = $scope.tour.floorplan[0].status;
                            }

                            if($scope.tour.floorplan[0].links.length > 0) {

                                angular.forEach($scope.tour.floorplan, function(value, key) {
                                    value.imageFloorplan = $scope.url + value.locationURL;
                                });

                                angular.forEach($scope.tour.floorplan[0].links, function(link) {
                                    $scope.links.push(link);
                                });
                            }
                        }

						_initPano();

                        $scope.getTour      = true;
	                    $scope.isDataLoaded = true;
	                });
            	}

                //floorplan change pano 
                $scope.fpChangePano = function (index, pano) {
                    panoramaPOV.setPano(pano);
                }


            	$scope.changuePano = function(pano) {
            		$scope.pano  = pano;
            		_initPano();
            	}

            	$scope.backPanoChange = function() {

            		$scope.panoChange  = true;
            		$scope.panolinking = false;
                    $scope.panoInfo = false;
            		$scope.linkPanos   = [];
                    $scope.pano = jQuery.extend(true, {}, $scope.copyPano);
            	}


            	$scope.showPOV = function() {

            		$scope.panoChange  = false;
            		$scope.panolinking = true;
            		$scope.linkPanos   = _.map($scope.tour.pano, _.clone);
                    $scope.copyPano    = jQuery.extend(true, {}, $scope.pano);

            		angular.forEach($scope.pano.povLinks, function(value, key) {
            			angular.forEach($scope.linkPanos, function(v, k) {
            				if(value.pano == v.name) {
            					$scope.linkPanos.splice(k, 1);
            				}
            			});
					});
            	}

                $scope.showInfo = function() {
                    $scope.panoChange  = false;
                    $scope.panoInfo = true;
                }

                $scope.savePanoInfo = function(info) {
                    api.panos.update({id:$scope.pano.id}, {panoInfo:info}).then(function() {

                        api.flushCache();
                        $scope.pano.panoInfo = info;
                        toastr.success('Pano info save successfully', 'Success');
                        _getTour();
                        $scope.backPanoChange();


                    }).catch(function(err) {
                        console.log(err);
                        toastr.error('Cannot save the info', 'Error');
                    }).finally(function() {
                        $scope.isLoading = false;
                    }); 
                }

            	$scope.saveLink = function() {
            		var arrayPOV;

            		arrayPOV = [];

            		angular.forEach($scope.linkPanos, function(pano, key) {
            			var povlink;
            			
            			povlink = {};

            			if(pano.state == 'new') {

            				povlink.description = pano.description;
            				povlink.heading     = pano.heading;
            				povlink.pano        = pano.name;
            				povlink.state       = 'new';

            				arrayPOV.push(povlink);
            			}
					});

					angular.forEach($scope.pano.povLinks, function(pov, k) {
        				if(pov._id) {
        					arrayPOV.push(pov);
        				}
    				});

					api.panos.update({id:$scope.pano.id}, {povLinks:arrayPOV}).then(function() {

                        api.flushCache();
                        toastr.success('Pano link save successfully', 'Success');
                        $scope.backPanoChange();
                        _getTour();

            		}).catch(function(err) {
            			console.log(err);
                        toastr.error('Cannot save the pano', 'Error');
                    }).finally(function() {
                        $scope.isLoading = false;
                    });	
            	}

                $scope.removePanoLink = function(link) {
                    console.log(link);
                }

                $scope.checkPOVFields = function(link) {
                    if(!link || !link.description || !link.name || !link.heading) return true;
                }

            	$scope.newLink = function(link) {
            		link.state = 'new';
                    $scope.pov = link;

            		document.getElementById('previous').options[0].selected = true;
            		document.getElementById('description').value = "";
            		document.getElementById('heading').value = "";
            	}

            	$scope.editPovLink = function(link) {
            		link.state = 'edit';
                    $scope.pov = link;
            	}

                $scope.removePano = function() {
                    console.log("remove pano:" + $scope.pano.name);

                    api.panos.remove({id: $scope.pano.id}).then(function() {
                        _removeLinks($scope.pano, "pano");
                        _removeLinks($scope.pano, "floorplan");

                    }).catch(function(err) {
                        console.log(err);
                        toastr.error('Cannot delete the pano', 'Error');
                    }); 
                }

                function _removeLinks(pano, type) {
                    var update,
                        promises;

                    promises = []; 
                    update   = false;

                    if(type == "pano") {

                        angular.forEach($scope.tour.pano, function(p, index) {
                            if(p.povLinks.length > 0) {
                                angular.forEach(p.povLinks, function(link, i) {
                                    if(link.pano == pano.name) {
                                        update = true;
                                        console.log(p);
                                        console.log(p.povLinks);
                                        p.povLinks.splice(i,1);
                                    }
                                });

                                if(update) {
                                    update = false;
                                    promises.push(api.panos.update({id:p.id}, {povLinks: p.povLinks}));
                                }
                            }
                        });

                    }else if(type == "floorplan") {

                        angular.forEach($scope.tour.floorplan, function(fp, index) {
                            if(fp.links.length > 0) {
                                angular.forEach(fp.links, function(link, i) {
                                    if(link.panoName == pano.name) {
                                        update = true;
                               
                                        fp.links.splice(i,1);
                                        jquery("#"+link.idLink).remove();
                                        jquery("#box"+link.idLink).remove();
                                    }
                                });

                                if(update) {
                                    update = false;
                                    promises.push(api.floorplans.update({id:fp.id}, {links: fp.links}));
                                }
                            }
                        });
                    }

                    $q.all(promises).then(function(responses) {
                        api.flushCache();
                        _getTour();
                    });
                } 

                $scope.$watch('loadedTour', function(newVal) {
                    if(newVal) {
                        setTimeout(function() {
                            google.maps.event.trigger(panoramaPOV, "resize");
                            $scope.populateFloorplan($scope.links);
                            $scope.slideLoad = true;
                            jquery('#lightSlide').lightSlider();
                            $scope.$apply();
                        }, 1000);
                    }
                })


// --------------------------  floorplan linking section. --------------------------------------------

                $scope.populateFloorplan = function(links) {
                    var elm;
                    
                    elm = document.getElementById('floorplan');

                    angular.forEach(links, function(obj) {
                        _createCameraLink(elm, obj.position, obj.idLink);
                    });
                }

                function _getPercentPosition(position) {
                    var imgWidth,
                        imgHeight,
                        percent;
                    
                    percent   = {};
                    imgWidth  = jquery("#floorplan").width();
                    imgHeight = jquery("#floorplan").height();
                    
                    percent.left = (position.left * 100) / imgWidth;
                    percent.top  = (position.top * 100) / imgHeight;
                    
                    return percent;
                }

                //get coordinate inside of image 
                $scope.getCordinate = function(e) {
                    var posX,
                        posY,
                        imgPos,
                        elm,
                        position,
                        id,
                        percentPos;

                    elm    = e.target;
                    imgPos = _findPosition(elm);

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

                    percentPos = _getPercentPosition(position);

                    if(_panoAvailable()) {

                        _createCameraLink(elm, position, id);

                        $scope.links.push({
                            position   : position,
                            percentPos : percentPos,
                            idLink     : id,
                            pano       : $scope.pano.id,
                            panoName   : $scope.pano.name
                        });
                    }else {
                        alert("this pano have a link");
                    }
                }

                function _panoAvailable() {
                    var flag;

                    flag = true;

                    if($scope.links.length > 0) {

                        angular.forEach($scope.links, function(obj) {
                            if($scope.pano.id == obj.pano) {
                                flag = false;
                            }    
                        })
                    }

                    return flag;
                }

                // create a element to link panos
                function _createCameraLink(imgElm, position, id) {
                    var cam;

                    cam = document.createElement("i");
                    cam.setAttribute("id", id);
                    cam.classList.add("fa");
                    cam.classList.add("fa-camera");
                    cam.style.position = "absolute";
                    cam.style.zIndex   = "1";
                    cam.style.top      = parseInt(position.top)  + jquery("#floorplan").position().top  + "px";
                    cam.style.left     = parseInt(position.left) + jquery("#floorplan").position().left +  "px";
                    cam.style.cursor   = "pointer";

                    imgElm.parentNode.insertBefore(cam, imgElm);

                    jquery("#"+id).on("click", function(event) {
                        // $scope.linkInfo(id);
                        _createBox(cam, position, id);
                        $scope.$apply();
                    })
                }

                function _addInfoBox(elm, id) {
                    var a,
                        text,
                        remove,
                        btn,
                        index;

                        remove = false;

                        btn = [{
                            text   : "Go to",
                            index  : null,
                            method : function() {
                                $scope.fpChangePano(index, $scope.links[index].panoName);
                                $scope.$apply();
                            }  
                        },
                        {
                            text   : "Remove",
                            index  : null,
                            method : function() {

                                $scope.links.splice(index, 1);
                                jquery("#"+id).remove();
                                jquery("#box"+id).remove();
                            } 
                        }]

                    angular.forEach($scope.links, function(link, i) {

                        if(link.idLink == id && link.pano != null) {    
                            remove = true;
                            index  = i;
                        }        
                    }); 

                    if(remove) {

                        for(var i = 0; i <= 1; i++) {
                                
                                text = document.createTextNode(btn[i].text +' '+ $scope.links[index].panoName);
                                a    = document.createElement('a');

                                a.style.display = "block";    
                                a.setAttribute('href', "#");
                                a.appendChild(text);
                                elm.appendChild(a);

                                jquery(a).on("click", btn[i].method)
                        }
                    }else {

                        angular.forEach($scope.links, function(link, index) {

                            if(link.idLink == id) { 

                               text  = document.createTextNode("Go to pano" + link.panoName);
                                a    = document.createElement('a');

                                a.setAttribute('href', "#");
                                a.appendChild(text);
                                elm.appendChild(a);

                                jquery(a).on("click", function(event) {
                                    $scope.$apply();
                                })
                            }        
                        });
                    }   
                }

                function _createBox(elm, position, id) {
                    var box;

                    if(jquery("#box"+id).length) {

                        jquery("#box"+id).toggle();                            
                    }else {
                        box = document.createElement("div");
                        box.setAttribute('id', "box"+id);
                        box.classList.add("linkBox");
                        box.style.top      = ((parseInt(position.top)  + jquery("#floorplan").position().top) - 30)  + "px";
                        box.style.left     = ((parseInt(position.left) + jquery("#floorplan").position().left) + 20) + "px";
                        jquery(box).insertAfter(elm);

                        _addInfoBox(box, id);
                    }
                }

                //find position of the floorplan img in the page
                function _findPosition(element) {
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

                //save floorplan links
                $scope.saveFP = function() {
                    var data;
                    
                    $scope.isLoading = true;

                    data = {
                        links  : $scope.links,
                        status : $scope.status
                    }

                    api.floorplans.update({id:$scope.tour.floorplan[0].id}, data).then(function() {
                        $scope.tour.floorplan[0].links = $scope.links;
                        toastr.success('Tour link save successfully', 'Success');
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