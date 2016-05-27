(function() {
    'use strict';

    var toastr,
        jquery;

    toastr = require('toastr');
    jquery = require('jquery');

    module.exports = ['$scope','tours.api', '$q', '$state',
        function($scope, api, $q, $state) {
            console.log("in images controller");
        }
    ];

})();