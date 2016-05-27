(function() {
    'use strict';

    var auth;

    auth = ['utils.API', function(API) {
    	var api;

        api = new API([
            {name: 'login',    url: '/login'},
            {name: 'users',    url: '/users/{id}'},
            {name: 'forgot',   url: '/forgot'},
            {name: 'token',   url: '/validToken'},
            {name: 'reset',   url: '/resetPassword'}
        ]);

        api.config.setPrefix(window.api.pathPrefix);

        this.getUsers = function(filters) {
            return api.users.get(filters)
        };

        this.getUser = function(params) {
            return api.users.get(params)
        };

        this.authenticateUser = function(user) {
            return api.login.create({}, user)
        };

        this.registerUser = function(user) {
            return api.users.create(undefined, user);
        };

        this.updateUser = function(user) {
            return api.users.update({id: user.id}, user)
        };

        this.forgot = function(email) {
            return api.forgot.create(undefined, {email:email})
        }

        this.token = function(token) {
            return api.token.create(undefined, {token:token})
        }

        this.reset = function(user) {
            return api.reset.create(undefined, user)
        }
    }];

    module.exports = auth;

})();