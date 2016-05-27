(function() {
    'use strict';

    var logout;

   	logout = ['$http', function($http) {

        $http.get('/logout');

        location.reload();

    }];

    module.exports = logout;
})();