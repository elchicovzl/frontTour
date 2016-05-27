(function() {
    'use strict';

    var angular,
        moduleName;

    angular    = require('angular');
    moduleName = 'tours';

    require('angular-file-upload');
    require('ng-file-upload');

    angular.module(moduleName, [
        require('../utils/utils'),
        'angularFileUpload',
        'ngFileUpload'
    ])

    .controller('tours.myTours'        , require('./controllers/myTours'))
    .controller('tours.editTour'       , require('./controllers/editTour'))
    .controller('tours.createTour'     , require('./controllers/createTour'))
    .controller('tours.linkTours'      , require('./controllers/linkTour'))
    .controller('tours.viewTour'      , require('./controllers/viewTour'))
    .controller('tours.floorplan'      , require('./controllers/floorplan'))
    .controller('tours.images'      , require('./controllers/images'))

    .directive('uploadFile', require('./directives/uploadFile'))
    .directive('uploaderTour', require('./directives/uploaderTour'))
    .directive('showFile', require('./directives/showFile'))
    .directive('populateFp', require('./directives/populateFp'))

    .factory('tours.Tour', require('./factories/Tour'))

    .service('tours.api', require('./services/api'))

    .config(require('./config'));

    module.exports = moduleName;
})();
