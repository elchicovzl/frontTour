(function() {
    'use strict';

    module.exports = ['$rootScope', 'users.User', '$window', '$state',
        function($rootScope, User, $window, $state) {
            var _user;

            //redirection if the user is log in or not
            $rootScope.$on('$stateChangeStart', function(event, toState) {

                if(window.user !== undefined) {
                    _user = $rootScope.user = window.user && new User(window.user);
                }

                if((toState.name === 'login' || toState.name === 'register') && _user !== undefined) {
                    event.preventDefault();
                    $state.go('home.overview')

                } else if(toState.authenticate && _user === undefined) {
                    event.preventDefault();
                    $state.go('login')
                }
            });
        }
    ];
})();