var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    Course = require('../models/course').Course,
    Review = require('../models/review').Review,
    mid = require('../middleware/auth'),
    moment = require('moment');

//GET /api/courses 200
// Get all courses with no authentiation required
router.get('/',  function(req, res, next){
    console.log('log get all courses route');
    // This is how you only return id and title properties
    Course.find({}, '_id title')
      .exec(function(err, course){
        if (err) return next(err);
        if (!course) {
          err = new Error('No Courses Found');
          err.status = 404;
          return next(err);
        }
        res.json(course);
        res.status(200);
        res.end();
      });
});

// POST /api/courses 201
// POST new course to database
router.post('/', mid.authenticate, function(req, res, next) {
  console.log('req user id = ' + req.user._id);
  console.log('log post new course route');
  req.body.user = req.user._id;
  var course = new Course(req.body);
  course.save(function(err, user){
    if (err) return next(err);
    res.status(201);
    res.location('/');
    res.end();
  });  
});

// PUT /api/courses 204
// Updates a Course on the database with user authentication required
router.put('/:courseId', mid.authenticate, function(req, res, next){
  console.log('req user id = ' + req.user._id);
  console.log('log update course route');
  if (!req.user._id) {
    var err = new Error('You must enter a valid username and password to access this page.');
	  err.status = 401;
	  return next(err);
  }
  var id = req.params.courseId;
  req.body.user = req.user._id; 
  Course.findByIdAndUpdate(id, req.body, function (err, course){
    if (err) return next(err);
      if (!course) {
        err = new Error('Not Found');
        err.status = 404;
        return next(err);
      }
    res.status(204);
    res.end();
  });
});

// POST /api/courses/:courseId/reviews 201
// POST adds new review to db if user is authenticated
router.post('/:courseId/reviews', mid.authenticate, function (req, res, next){
  Course.findOne({ _id: req.params.courseId})
    .populate('user')
    .exec(function(err, course){
      var courseUser = course.user._id.toString();
      var authUser = req.user._id.toString();
      if (err) {
        return next(err);
      } 
      //Current authenticated user cannot review their own course
      if (courseUser === authUser) {
        err = new Error('Sorry, this user cannot review their own course.');
        err.status = 401;
        return next(err);
      } else {
        req.body.user = course.user._id;
        req.body.postedOn = moment().format('YYYY-MM-DD');
        var review = new Review(req.body);
        course.reviews.push(review);
        review.save(function(err){
          if (err) return next(err);
        });

        course.save(function(err){
          if (err) return next(err);
        });

        res.status(201);
        res.location('/' + req.params.courseId);
        res.end();
      }
  });
});

// ***** Some Unsupported Routes for Later User  *****
 
// GET all courses on the database
// Return the Course id and title properties
// router.get('/all', function(req, res, next){
//     console.log('log get courses');
//     Course.find({})
//         .exec(function(err, course){
//         if(err) return next(err);
//         res.json(course);
//         });
// });
 
 

// Alternative POST new course to database without authenticate using session
// router.post('/', function(req, res, next) {
//   var course = new Course(req.body);
//   course.save(function(err, user){
//     if (err) return next(err);
//     res.status(201);
//     res.location('/');
//     res.end();
//   });  
// });

// POST new course to database
// router.post('/', function(req, res, next) {
//   if (!req.session.userId){
//       console.log('log there is no session user id');
//       var err = new Error('You must be logged-in to access this page.');
//       err.status = 400;
//       return next(err);
//   }
//   req.body.user = req.session.userId;
//   var course = new Course(req.body);
//   console.log('req.body.title = ' + req.body.title);
//   console.log('req.body.user = ' + req.body.user);
//   course.save(function(err, user){
//     if (err) return next(err);
//     res.status(201);
//     res.location('/');
//     res.end();
//   });  
// });


// Get courses for current authenticated user 200
// router.get('/',  function(req, res, next){
//     console.log('log get all courses route');
//     console.log('req user id = ' + req.user._id);
  //   if (!req.user._id) {
  //   var err = new Error('You must enter a valid username and password to access this page.');
	 // err.status = 401;
	 // return next(err);
  //   }
    
//     Course.find({user: req.user._id})
//       .select('title')
//       .exec(function(err, course){
//         if (err) return next(err);
//         if (!course) {
//           err = new Error('Not Found');
//           err.status = 404;
//           return next(err);
//         }
//         res.json(course);
//       });
// });

module.exports = router;