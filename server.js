var config,
    cookieParser,
    session,
    passport,
    bodyParser,
    name,
    app;

config        = require('./package.json').config;
name          = require('./package.json').name;

session       = require('express-session');
bodyParser    = require('body-parser' );
cookieParser  = require('cookie-parser' );
passport      = require('passport');
app           = require('express')();

//configuration
app.use(session({ secret: 'supernova', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(cookieParser());

//jade options
app.set('view options', { pretty: true });
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//configure routes
require('./routes')(app);

//check if code is being run by the terminal.
if(require.main === module) {
    app.listen(config.port, function() {
        console.log(name + ' listening in port ' + config.port);
    })
}

module.exports = app;