var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
var indexRouter = require('./routes/index');
var config = require('./config/globals');

var passport = require('passport');
var session = require('express-session');
var User = require('./models/user');
// importing github strategy

var githubStrategy = require('passport-github2').Strategy;
//var usersRouter = require('./routes/users');
var stocksRouter = require('./routes/stocks');
const { profile } = require('console');
var app = express();

// exporting db connection 



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(
  {
    secret: 'stockstracking',
    resave: false,
    saveUninitialized: false
  }

));
app.use(passport.initialize());
app.use(passport.session());

//configure local strat
passport.use(User.createStrategy());
//configure github strat
passport.use(new githubStrategy(
  {
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackUrl
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.findOne({ oauthId: profile.id });

      if (user) {
        return done(null, user);
      } else {
        const newUser = new User({
          username: profile.username,
          oauthId: profile.id,
          oauthProvider: 'Github',
          created: Date.now()
        });

        const savedUser = await newUser.save();
        return done(null, savedUser);
      }
    } catch (err) {
      return done(err);
    }
  }
));

//setting passport to read/write
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// routing
app.use('/', indexRouter);
app.use('/stocks', stocksRouter);
//app.use('/users', usersRouter);


//config for mongoose
mongoose
  .connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connection successful');
  })
  .catch((err) => {
    console.log('Connecting failed: ' + err);
  });

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
