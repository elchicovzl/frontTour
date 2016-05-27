(function() {
    'use strict';

    var angular,
        moduleName;

    moduleName = 'users';
    angular    = require('angular');

    require('angular-gravatar');

    angular.module(moduleName, ['ui.gravatar', require('../utils/utils')])

        .run(require('./run'))

        .factory('users.User', require('./factories/User'))

        .service('users.auth', require('./services/auth'))

        .controller('users.login'   , require('./controllers/login'))
        .controller('users.logout'  , require('./controllers/logout'))
        .controller('users.register', require('./controllers/register'))
        .controller('users.profile', require('./controllers/profile'))
        .controller('users.forgot', require('./controllers/forgot'))
        .controller('users.reset', require('./controllers/reset'))
        .directive('matchPassword'  , require('./directives/matchPassword'));
        //.directive('spinner'        , require('./directives/spinner'));

    module.exports = moduleName;
})();