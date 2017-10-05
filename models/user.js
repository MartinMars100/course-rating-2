'use strict';

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

// User schema
// EmailAddress uses a mongoose custom validator
var UserSchema = new mongoose.Schema({
	fullName: {
		type: String,
		required: [true, 'Full Name is required']
	},
	emailAddress: {
		type: String,
		unique: true,
		validate: {
      validator: function(v) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
      },
      message: 'Please Enter a Valid Email Address'
    }
	},
	password: {
		type: String,
		required: [true, 'Password is required']
		
		// validate: [validator.isEmail, 'Valid Email address is required.']
		// validate: [validateEmail, "Valid Email address is required."]
	}
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(emailAddress, password, callback) {
  console.log('log authenticate function');
  console.log('log emailAddress = ' + emailAddress);
  User.findOne({ emailAddress: emailAddress })
      .exec(function (error,user) {
        if (error) {
          console.log('log model authenticate User.findOne fail 1');
          return callback(error);
        } else if ( !user ) {
          console.log('log model authenticate User.findOne fail 2');	
          var err= new Error('User not found.');
          err.status = 401;
          return callback(err);
        }    
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
              return callback(null, user);
          } else {
              return callback();
          }   
        });
      });
};

// hash password before saving to database
UserSchema.pre('save', function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err){
        return next(err);
    } 
    user.password = hash;
    next();
  });
});

var User = mongoose.model('User', UserSchema);
// var Review = mongoose.model('Review', ReviewSchema);
// var Course = mongoose.model('Course', CourseSchema);

// module.exports = User;

module.exports.User = User;

// module.exports.Review = Review;
// module.exports.Course = Course;