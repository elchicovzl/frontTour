'use strict';

(function() {
    module.exports = ['utils.helpers',
        function(helpers) {
            var Tour;

            Tour = function(options) {
                helpers.extend(this, options);
            };

            Tour.prototype.generateUUID = function() {
            	var a,
            		b;
            	
            	a = b = new Date().getTime();

            	for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');
            	return b
        	};

            return Tour;
        }
    ];
})();