(function() {
    'use strict';

    var moduleName;

    moduleName = 'utils';

    require('angular-ui-bootstrap');

    angular.module(moduleName, ['ui.bootstrap'])
        .factory('utils.API'       , require('./factories/API'))
        .factory('utils.Collection', require('./factories/Collection'))
        .factory('utils.modal'     , require('./factories/modal'))

        .directive('confirmationModal', require('./directives/confirmationModal'))
        .directive('awsImgLink'       , require('./directives/awsImgLink'))
        .directive('numericOnly'       , require('./directives/numericOnly'))
        .directive('loadingImg'       , require('./directives/loadingImg'))

        .provider('awsImgLinkConfig', require('./providers/awsImgLinkConfig'))

        .filter('capitalize', require('./filters/capitalize'))

        .service('utils.helpers', require('./services/helpers'));

    module.exports = moduleName;
})();