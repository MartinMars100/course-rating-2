var express = require('express'),
    router = express.Router(),
    auth = require('basic-auth');
    User = require('../models/user').User,
    Course = require('../models/course'),
    Review = require('../models/review'),
    mid = require('../middleware/auth');

//GET current authenticated user
router.get('/', mid.authenticate, function(req, res, next){
  // if (!req.user._id) {
  //   var err = new Error('You must enter a valid username and password to access this page.');
	 // err.status = 401;
	 // return next(err);
  // }
  User.findById(req.user._id)
    .exec(function(err, user){
    if(err) return next(err);
    res.json(user);
    });
});

// .get(mid.requiresSignIn, function(req, res, next) {
// var credentials = auth(req);
// console.log(credentials);
// User.authenticate(credentials.name, credentials.pass, function(error, user){
//   if (error) {
//     return next(error);
//   } else {
//     res.status(200);
//     return res.send(credentials.name);
//   }
// });
// })`




// Alternative way -Returns the current authenticated user using session
// router.get('/', function(req, res, next){
//     console.log('log get current authenticated user');
//     console.log('log session id is = ' + req.session.userId);
//     if (!req.session.userId){
//       console.log('log there is no session user id');
//       var err = new Error('You must be logged-in to access this page.');
//       err.status = 400;
//       return next(err);
//     }
//     User.findById(req.session.userId)
//         .exec(function(err, user){
//           if(err) return next(err);
//           res.json(user);
//         });
// });

// POST /api/users 201
// Creates a user, sets the Location header to "/", and returns no content */
router.post('/', function(req, res, next) {
  if (req.body.fullName &&
      req.body.emailAddress &&
      req.body.password &&
      req.body.confirmPassword) {
        //   confirm that user typed same password twice
        if (req.body.password !== req.body.confirmPassword) {
          console.log('log passwords are not the same');
          var err = new Error('Passwords do not match.');
          err.status = 400;
          return next(err);
        }
          
        // var user = new models.User(req.body);
        var user = new User(req.body);
        user.save(function(err) {
          if (err) return next(err);
            res.status(201);
            // res.location('/');
            res.end();
        });
      } else {
        console.log('log All fields are not entered');
        err = new Error('All fields required');
        err.status = 400;
        return next(err);
      }
  
});

// Returns all users
router.get('/all', function(req, res, next){
    console.log('log get users');
    User.find({})
        .exec(function(err, user){
        if(err) return next(err);
        res.json(user);
        });
});

module.exports = router;