var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var consumables = require('./routes/consumables');
var modifiers = require('./routes/modifiers');
var sizes = require('./routes/sizes');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var User = require('./routes/user');
var users = require('./routes/users');
var auth = require('./routes/auth');
var live = require('./routes/live');
//var location = require('./routes/location');
var corser = require('corser');
var recommendations = require('./routes/recommendations');
var images = require('./routes/images');

var app = express();

// Socket IO
var server = require('http').Server(app);
var io = require('socket.io')(server);

var config = require('./config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// CORS
app.use(corser.create({
    requestHeaders: corser.simpleRequestHeaders.concat(["x-access-token"])
}));

// Socket IO
app.use(function (req, res, next) {
    res.io = io;
    next();
});

// Live Cart Variable
cart = [];
ids = [];

// Public APIs
app.use('/', index);
app.use('/live', live);

app.use('/', auth);
// Secure APIs
app.use('/consumables', consumables);
app.use('/modifiers', modifiers);
app.use('/sizes', sizes);
app.use('/users', users);
app.use('/recommendations', recommendations);
app.use('/images', images);
//app.use('/test,', location);


// Connect to Mongo
var mongoUrl = config.mongoUrl;
mongoose.connect(mongoUrl);
console.log('Connecting to mongo at ' + mongoUrl);
autoIncrement.initialize(mongoose);

// Check if default user needs to be created
if (config.createDefault) {
    var defaultUser = new User({
        username: config.defaultUser,
        password: config.defaultPass,
        admin: true
    });

    User.findOne({
        username: config.defaultUser
    }, function (err, user) {
        if (err) throw err;
        if (!user) {
            defaultUser.save(function (err) {
                if (err) throw err;
                console.log('Default user created');
            });
        } else {
            console.log('Default user already exists, did not create')
        }
    });
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = {app: app, server: server};

