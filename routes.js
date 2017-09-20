var express = require('express'),
    router = express.Router(),
    User = require('./models').User,
    mid = require('./middleware/auth');

router.get('/', function(req, res, next){
    console.log('log get all users route');
    User.find({})
             .exec(function(err, users){
               if(err) return next(err);
               res.json(users);
             });
});

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

module.exports = router;