(function() {
    'use strict';

    var moduleName,
        angular;

    moduleName = 'error';
    angular    = require('angular');


    angular.module(moduleName, [])
        .config(require('./config'))
        .service('error.errorHandler', require('./services/errorHandler'));

    module.exports = moduleName;
})();