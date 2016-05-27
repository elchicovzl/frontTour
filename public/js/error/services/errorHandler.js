'use strict';

(function() {
    var toastr,
        messages;

    toastr = require('toastr');

    messages = {
        NOT_FOUND             : 'Resource is not found',
        FORBIDDEN             : 'You are not allowed in this section',
        BAD_REQUEST           : 'There was an error in your request',
        UNAUTHORIZED          : 'Please sign in to access this section',
        INTERNAL_SERVER_ERROR : 'Something went wrong in the server'
    };

    module.exports = ['$q',
        function($q) {
            _handleError.INTERNAL_SERVER_ERROR = 500;
            _handleError.NOT_FOUND             = 404;
            _handleError.FORBIDDEN             = 403;
            _handleError.BAD_REQUEST           = 400;
            _handleError.UNAUTHORIZED          = 401;
            _handleError.CUSTOM_MESSAGE        = 1;

            function _getTypeError(response) {
                var typeError;

                if(typeof (response.data.message || (response.data.error && response.data.error.message)) === 'string') {
                    typeError = _handleError.CUSTOM_MESSAGE;
                } else {
                    typeError = response.status;
                }

                return typeError;
            }

            function _handleError(response) {
                var message;

                switch(_getTypeError(response)) {

                    case _handleError.CUSTOM_MESSAGE:
                        message = response.data.message || response.data.error.message;
                        break;

                    case _handleError.INTERNAL_SERVER_ERROR:
                        message = messages.INTERNAL_SERVER_ERROR;
                        break;

                    case _handleError.NOT_FOUND:
                        message = messages.NOT_FOUND;
                        break;

                    case _handleError.BAD_REQUEST:
                        message = response.data.errors && response.data.errors[0];
                        break;

                    case _handleError.FORBIDDEN:
                        message = messages.FORBIDDEN;
                        break;

                    case _handleError.UNAUTHORIZED:
                        message = messages.UNAUTHORIZED;

                        //logout the user
                        setTimeout(function() {
                            window.location.href = window.baseUrl + '/logout'
                        },2000);

                        break;
                }

                message = message || messages.unknown;

                toastr.error(message, messages.title);
            }


            this.responseError = function(response) {

                /*
                 * Work around for overriding this handler. This function will run after browser processing had
                 * finished.
                 */
                setTimeout(function() {
                    if(response.isOverrideHandler === true) return;

                    _handleError(response);

                }, 0);

                return $q.reject(response);
            };
        }
    ];
})();