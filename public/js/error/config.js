(function() {
    'use strict';

    module.exports = ['$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('error.errorHandler')
        }
    ];

})();

