var express = require('express');
var path = require('path');
var logger = require('morgan');
var validator = require('express-validator');
var cookieParser = require('cookie-parser');
var expressHbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session  = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);

var userRoutes = require('./routes/user');
var checkoutRoutes = require('./routes/checkout');
var index = require('./routes/index');
let updateRoutes = require('./routes/update');

var app = express();

mongoose.connect('mongodb://dbuser:dbpassword1@ds141178.mlab.com:41178/heroku_xrd3kmbd', {useNewUrlParser: true });
//mongoose.connect('localhost:27017/shopping');
require('./config/passport');

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'my secret password',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 1800000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});

app.use('/update', updateRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/user', userRoutes);
app.use('/', index);

/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
