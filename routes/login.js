var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    Course = require('../models/course'),
    Review = require('../models/review'),
    mid = require('../middleware/auth');

router.get('/', function(req, res, next){
    // return res.render('login', {title: 'Log In'});
    return res.send('login get');
});

// Calls the authenticate function from the User model
// If the authenticate passes it will create a session id
router.post('/', function(req, res, next){
  if (req.body.emailAddress && req.body.password) {
    console.log('email and password are ok');
    User.authenticate(req.body.emailAddress, req.body.password, function (error, user) {
      if(error || !user) {
        console.log('Error authenticating User');
        var err = new Error('Wrong emailAddress or password.');
        err.status = 401;
        return next(err);
      } else {
        console.log('log before store session');
        req.session.userId = user._id;
        req.data = user;
        res.end();
        // return res.redirect('/profile');
      }   
    }); 
  } else {
    var err = new Error('Email and password are required');
    console.log('Email and password are required');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;