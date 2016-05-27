(function(w) {
    'use strict';

    var angular,
        appName,
        googleMapsLoader;

    appName          = 'virtualitour';
    angular          = require('angular');
    googleMapsLoader = require('google-maps');

    window.jQuery    = require('jquery');

    require('bootstrap');
    require('angular-ui-router');
    require('angular-messages');
    require('angular-bootstrap-show-errors');


    angular.module(appName, [
        'ngMessages',
        'ui.router',
        'ui.bootstrap.showErrors',

        require('./users/users'),
        require('./error/error'),
        require('./tours/tours')
    ])

	.config(require('./config'));

    // loading google maps api before instantiating application
    googleMapsLoader.load(function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, [appName]);
        });
    });
})(window);