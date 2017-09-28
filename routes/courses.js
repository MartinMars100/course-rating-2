var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    Course = require('../models/course').Course,
    mid = require('../middleware/auth');

// GET all courses on the database
// Return the Course id and title properties
router.get('/all', function(req, res, next){
    console.log('log get courses');
    Course.find({})
        .exec(function(err, course){
        if(err) return next(err);
        res.json(course);
        });
});

// Get courses for current authenticated user 200
router.get('/', mid.authenticate, function(req, res, next){
    console.log('log get all courses route');
    console.log('req user id = ' + req.user._id);
    if (!req.user._id) {
    var err = new Error('You must enter a valid username and password to access this page.');
	  err.status = 401;
	  return next(err);
    }
    
    Course.find({user: req.user._id})
      .select('title')
      .exec(function(err, course){
        if (err) return next(err);
        if (!course) {
          err = new Error('Not Found');
          err.status = 404;
          return next(err);
        }
        res.json(course);
      });
});

// POST new course to database
router.post('/', mid.authenticate, function(req, res, next) {
  console.log('req user id = ' + req.user._id);
  console.log('log post new course route');
  if (!req.user._id) {
    var err = new Error('You must enter a valid username and password to access this page.');
	  err.status = 401;
	  return next(err);
  }
  
  req.body.user = req.user._id;
  var course = new Course(req.body);
  console.log('req.body.title = ' + req.body.title);
  console.log('req.body.user = ' + req.body.user);
  course.save(function(err, user){
    if (err) return next(err);
    res.status(201);
    res.location('/');
    res.end();
  });  
});

//GET /api/courses/:courseId
// GET a particular course using the course Id parameter
router.get('/:courseId', mid.authenticate, function(req, res, next){
  if (!req.user._id) {
    var err = new Error('You must enter a valid username and password to access this page.');
	  err.status = 401;
	  return next(err);
  }
  Course.findById(req.params.courseId)
    .populate('reviews')
    .populate('user', '_id fullName')
    .exec(function(err, course) {
      if (err) return next(err);
      res.json(course);
    });
 });

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

// PUT /api/courses/:courseId 204
 

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


module.exports = router;