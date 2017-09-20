var express = require('express'),
    router = express.Router(),
    User = require('./models').User,
    mid = require('./middleware/auth');
    // Loan = require("../models").Loan,
    // Patron = require("../models").Patron,
    // moment = require('moment');

// GET /api/users 200 
// Return the current authenticated user 
// router.get('/', mid.authenticate, function(req, res, next) { 
    // router.get('/', function(req, res, next) { 
    //   res.json({response: "You sent me a GET request"}) ;
//     console.log('log get user fired');
//     res.send({
// 		        _id: req.user._id,
// 		        fullName: req.user.fullName
// 	});
	  // get user from req and send as json object 
    // res.json({
    //   data: [req.user]
    // });
// });

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
          
        //   create object with form input
        var userData = {
          fullName: req.body.fullName,  
          email: req.body.emailAddress,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword
        };
          
        console.log('log almost to create User');
        console.log('log req.body.fullName = ' + req.body.fullName);
        
        // return res.status(201)
        // .location('/')
        // .end();
        
        // var user = new models.User(req.body);
        var user = new User(req.body);
        user.save(userData,function(err) {
          if (err) return next(err)
            res.status(201);
            // res.location('/');
            res.end();
        });
        
        //   use schema's create method to insert documet into Mongo
      //   User.save(userData, function(error) {
      //     console.log('Inserting into MongoDb');
			   // if (err) {
			   //   console.log('error creating User');
				  //   return next(err);
		    //   } else {
				  //     return res.status(201)
					 //   .location('/')
					 //   .end();	
			   // }
      //   });
          
      } else {
        console.log('log All fields are not entered');
        err = new Error('All fields required');
        err.status = 400;
        return next(err);
      }
  
});

module.exports = router;