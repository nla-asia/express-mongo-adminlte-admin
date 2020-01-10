require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts');
var mongoose = require("mongoose");
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var User = require('./models/user');
var bcrypt = require('bcryptjs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/admin/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', 'admin/admin_layout');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//db config
mongoose.Promise = global.Promise;
mongoose.connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true, autoIndex: false, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false },
    (err) => {
        if (err) {
            console.log(err);
            console.log("Can't connect to db.");
        } else {
            console.log('Connected to db.')
        }
    }
);


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new Strategy(
  function(email, password, cb) {
     User.findByEmail(email).then((user)=>{
     if (!user) { return cb(null, false); }
     if (!bcrypt.compareSync(password, user.password)) {
        return cb(null, false); 
      }
     return cb(null, user);
     });

  }));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {

  User.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });

});

// Initialize session
app.use(session({ 
  secret: process.env.SESSION_KEY, 
  resave: false, 
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
 }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/admin/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
