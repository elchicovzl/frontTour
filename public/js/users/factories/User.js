(function() {
    'use strict';

    var User;

    User = ['utils.helpers', function(helpers) {
    	var User;

    	User = function(options) {
            helpers.extend(this, options);
        };

        /**
         * Returns the user's full name.
         * @returns {string}
         */
        User.prototype.getFullName = function() {
            return this.name + ' ' + this.lastName;
        };

        return User;
    }];

    module.exports = User;
})();