'use strict';

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

console.log('log Date.now = ' + Date.now);

// Review Schema
var ReviewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  postedOn: { type: Date, default: Date.now },
  rating: {
  	type: Number,
  	required: [true, "Rating is required."],
  	min: [1, '1 is the minimum rating.'],
  	max: [5, '"5" is the maximum rating.']
  },
  review: String
});

// var User = mongoose.model('User', UserSchema);
var Review = mongoose.model('Review', ReviewSchema);
// var Course = mongoose.model('Course', CourseSchema);

// module.exports.User = User;
module.exports.Review = Review;
// module.exports.Course = Course;