var api,
    config,
    request,
    passport,
    _hostname,
    LocalStrategy,
    _authenticate,
    _forwardRequest,
    _useRequestToRespond,
    sessionToken;

axios         = require('axios');
passport      = require('passport');
LocalStrategy = require('passport-local').Strategy;
request       = require('superagent');
config        = require('../package.json').config;

_hostname = config.api.hostname;

api = function(req, res, next) {
    var path,
        method;

    path   = req.originalUrl.replace(config.api.pathPrefix, '');
    method = req.method.toLowerCase();
   
    if(path === '/login' && method === 'post') {
        _authenticate(req, res, next);
    } else {
        _forwardRequest(req, res, next);
    }
};

_useRequestToRespond = function(res, response) {
    res.status(response.status).json(response.data);
};

_authenticate = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {

        if(err) {
            res.status(401).json(err);

        } else if(user === false) {
            res.status(422).json({err: 'PARAMS_MISSING', message: info.message});

        } else {
            req.login(user.user, function() {

            });

            res.json(user);
        }

    })(req, res, next);
};

_forwardRequest = function(req, res, next) {
    var body,
        path,
        method,
        config;

    path   = req.originalUrl.replace('/api', "");
    method = req.method.toLowerCase();

    if (method !== 'get' || method !== 'delete') {
        body = req.body;
    }
    
    axios.defaults.headers.common['Auth-Token'] = sessionToken;

    axios[method](_hostname + path, body).then(_useRequestToRespond.bind({}, res)).catch(_useRequestToRespond.bind({}, res))
};

// PASSPORT ------------------------------------------------------------------------------

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Use the LocalStrategy within Passport to login users.
passport.use(new LocalStrategy(
    {passReqToCallback : true}, //allows us to pass back the request to the callback
    function(req, username, password, done) {
        // var path = req.originalUrl;
        var path = _hostname + "/login";

        axios.post(path, req.body)

            .then(function (response) {
                sessionToken = response.data.token;
                return done(null, response.data);
            })

            .catch(function (err) {
                return done(err.data);
            });
    }
));

module.exports = api;