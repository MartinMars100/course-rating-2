var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    Course = require('../models/course').Course,
    mid = require('../middleware/auth');

//GET /api/course/:courseId
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

module.exports = router;