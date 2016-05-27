(function() {
	'use strict';

	var jquery;

    jquery = require('jquery');

    jquery.fn.extend({
        textProgress : function (value) {
            this.find(".tp + .tp, .progress").css("width", value + "%").find(".percent").animate({
                Counter : parseInt(value)
            }, {
                step : function (now) {
                    $(this).text(Math.ceil(now))
                }
            });
        }
    });

	module.exports =['utils.Collection' , 
		function(Collection) {
			return {
				restrict : 'A',
				ngModel  : '=',
      			link: function(scope, el, attrs) {
			        var url,
			        	totalPanos,
			        	currentPanos,
			        	floorplan;

			        url = window.api.hostname + "/files";

			        scope.$watch('tour', function(tour) {

				        totalPanos   = tour.pano.length;
				        currentPanos = 0;
				        floorplan    = false;

				        if(tour.floorplan.length > 0) {
				        	totalPanos = totalPanos + 1;
				        }

				        if(!floorplan && tour.floorplan.length > 0 && totalPanos > 0) {
			        		var newImage,
                    			loadElm;

							newImage = url + "/" + tour.floorplan[0].locationURL;
                    		loadElm  = angular.element(document.createElement('img'));
                    		loadElm.attr('src', newImage);

                    		loadElm.bind('load', function() {
	                    		var loaded;	

	                    		currentPanos++;

	                    		loaded = currentPanos / totalPanos * 100;
	                    		
	                    		el.css("width",  loaded+"%");

	                    		scope.$apply(function() {
	                    			scope.$parent.ploaded = Math.ceil(loaded);
									if(loaded == 100) {
										scope.$parent.loadedTour = true;
										scope.$parent.getTour    = false;
									} 
								});
	                    	})
                    	}	
						
						if(totalPanos > 0) {

							angular.forEach(tour.pano, function(value, key) {
		                    	var newImage,
		                    		loadElm;

		                    	newImage = url + "/" + value.locationURL;

		                    	loadElm = angular.element(document.createElement('img'));
		                    	loadElm.attr('src', newImage);
		                    	loadElm.bind('load', function() {
		                    		var loaded;	

		                    		currentPanos++;

		                    		loaded  = currentPanos / totalPanos * 100;

		                    		el.css("width",  loaded+"%");

		                    		scope.$apply(function() {
		                    			scope.$parent.ploaded = Math.ceil(loaded);
										if(loaded == 100) {
											scope.$parent.loadedTour = true;
											scope.$parent.getTour    = false;
										} 
									});
		                    	})
							});
						}else {
							scope.$parent.empty      = true;
							scope.$parent.getTour    = false;
						}

				    }, true);
			    }
			}
		}] 
})()