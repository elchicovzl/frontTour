'use strict';

(function() {
    var config;

    config = ['$stateProvider','$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

        // use the HTML5 History API
        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/home/overview');

        $stateProvider
            .state('login', {
                url          : '/login',
                templateUrl  : '/public/views/users/login.html',
                controller   : 'users.login'
            })

            .state('register', {
                url          : '/register',
                templateUrl  : '/public/views/users/register.html',
                controller   : 'users.register'
            })

            .state('forgot', {
                url          : '/forgot',
                templateUrl  : '/public/views/users/forgot.html',
                controller   : 'users.forgot'
            })

            .state('reset', {
                url          : '/reset/:token',
                templateUrl  : '/public/views/users/reset.html',
                controller   : 'users.reset'
            })

            .state('logout', {
                url          : '/logout',
                controller   : 'users.logout'
            })

            .state('home', {
                url          : '/home',
                templateUrl  : '/public/views/main.html',
                abstract     : true
            })

            .state('home.overview', {
            	url          : '/overview',
                templateUrl  : '/public/views/home/overview.html',
                authenticate : true
            })

            .state('home.images', {
                url          : '/images',
                templateUrl  : '/public/views/images/images.html',
                controller   : 'tours.images',
                authenticate : true
            })

            .state('home.createTour', {
                url          : '/tours/create',
                templateUrl  : '/public/views/tours/create.html',
                controller   : 'tours.createTour',
                authenticate : true
            })

            .state('home.editTour', {
                url          : '/tours/:id',
                templateUrl  : '/public/views/tours/create.html',
                controller   : 'tours.editTour',
                authenticate : true
            })

            .state('home.linkTour', {
                url          : '/tours/:id/link',
                templateUrl  : '/public/views/tours/link.html',
                controller   : 'tours.linkTours',
                authenticate : true
            })

            .state('home.floorplan', {
                url          : '/tours/:id/floorplan',
                templateUrl  : '/public/views/tours/floorplan.html',
                controller   : 'tours.floorplan',
                authenticate : true
            })

            .state('home.myTours', {
                url          : '/tours',
                templateUrl  : '/public/views/tours/mytours.html',
                authenticate : true,
                controller   : 'tours.myTours'
            })

            .state('home.viewTour', {
                url          : '/tours/:id/view',
                templateUrl  : '/public/views/tours/viewTour.html',
                authenticate : false,
                controller   : 'tours.viewTour'
            })

            .state('home.profile', {
                url          : '/profile/:id',
                templateUrl  : '/public/views/users/profile.html',
                authenticate : true,
                controller   : 'users.profile'
            })

            .state('home.settings', {
                url          : '/settings',
                templateUrl  : '/public/views/home/settings.html',
                authenticate : true,
            })

            .state('share', {
                url          : '/share/:id',
                templateUrl  : '/public/views/tours/share.html',
                authenticate : false,
                controller   : 'tours.viewTour'
            });
    }];

    module.exports = config;

})();
