var express = require('express'),
    router = express.Router(),
    User = require('../models/user').User,
    Course = require('../models/course').Course,
    mid = require('../middleware/auth');


//GET /api/course/:courseId 200
// GET a particular course using the course Id parameter
router.get('/:courseId', function(req, res, next){
  Course.findById(req.params.courseId)
    .populate('reviews')
    .populate('user', '_id fullName')
    .exec(function(err, course) {
      if (err) return next(err);
      res.status(200);
      res.json(course);
    });
 });

module.exports = router;