(function() {
    'use strict';

    module.exports = function() {

        this.$get = function() {
            return this;
        };

        this.getHostName = function() {
            return this.hostName || '';
        };

        this.setHostName = function(hostName) {
            this.hostName = hostName;
        };
    };
})();