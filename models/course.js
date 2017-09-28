'use strict';

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Course Schema
var CourseSchema = new mongoose.Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	title: {
      type: String,
      required: [true, "Title is Required"]
	},
	description: {
	  type: String,
	  required: [true, "Description is Required"]
	},
	estimatedTime: String,
	materialsNeeded: String,
	steps: [{
	  stepNumber: Number,
	  title: {
	    type: String,
	    required: [true, "Step must have a title."]
	  },
	  description: {
	    type: String,
	  	required: [true, "Step must have a description."]
	  }
	}],  
	reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});	

// var User = mongoose.model('User', UserSchema);
// var Review = mongoose.model('Review', ReviewSchema);
var Course = mongoose.model('Course', CourseSchema);

// exports.Review = Review;
module.exports.Course = Course;