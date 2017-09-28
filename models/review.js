'use strict';

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User schema
// var UserSchema = new Schema({
// 	fullName: {
// 		type: String,
// 		required: [true, 'Full Name is required']
// 	},
// 	emailAddress: {
// 		type: String,
// 		unique: true
// 	},
// 	password: {
// 		type: String,
// 		required: [true, 'Password is required']
// 	}
// });

// Review Schema
var ReviewSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  postedOn: Date,
  rating: {
  	type: Number,
  	required: [true, "Rating is required."],
  	min: [1, '1 is the minimum rating.'],
  	max: [5, '"5" is the maximum rating.']
  },
  review: String
});

// Course Schema
// var CourseSchema = new Schema({
// 	user: {type: Schema.Types.ObjectId, ref: 'User'},
// 	title: {
//       type: String,
//       required: [true, "Title is Required"]
// 	},
// 	description: {
// 	  type: String,
// 	  required: [true, "Description is Required"]
// 	},
// 	estimatedTime: String,
// 	materialsNeeded: String,
// 	steps: [{
// 	  stepNumber: Number,
// 	  title: {
// 	    type: String,
// 	    required: [true, "Step must have a title."]
// 	  },
// 	  description: {
// 	    type: String,
// 	  	required: [true, "Step must have a description."]
// 	  }
// 	}],  
// 	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]

// });	



// var User = mongoose.model('User', UserSchema);
var Review = mongoose.model('Review', ReviewSchema);
// var Course = mongoose.model('Course', CourseSchema);

// module.exports.User = User;
module.exports.Review = Review;
// module.exports.Course = Course;