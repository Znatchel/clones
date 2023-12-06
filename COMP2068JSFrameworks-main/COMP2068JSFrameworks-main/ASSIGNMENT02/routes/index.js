var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Stock Trader', user: req.user });
});

router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About Us', user: req.user});
});




// GET handler for the login page
router.get('/login', function (req, res, next) {
  let sessionMsgs = req.session.messages || [];
  req.session.messages = []; // clearing messages
  res.render('login', { title: 'Login', messages: sessionMsgs, user: req.user });
});

router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register', user: req.user });
});

router.post('/login', passport.authenticate(
  "local",
  {
    successRedirect: '/stocks',
    failureRedirect: '/login',
    failureMessage: 'invalid credentials',
  }
));

router.post('/register', function (req, res, next) {
  User.register(
    new User({
      username: req.body.username,
    }),
    req.body.password,
    (err, newUser) => {
      if (err) {
        console.log(err);
        return res.redirect('/register');
      } else {
        req.login(newUser, (err) => {
          if (err) {
            console.log(err);
            return res.redirect('/register');
          }
          res.redirect('/stocks'); 
        });
      }
    }
  );
});

router.get('/logout', function (req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

//get handler /github
//triggers github button and sends user to github.com
router.get('/github', passport.authenticate('github',{scope: ['user.email']}));

//call back github

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res, next) => {
    // Successful authentication, redirect to a different page if needed
    res.redirect('/stocks');
  }
);

module.exports = router;