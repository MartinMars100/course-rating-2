'use strict';

var auth = require('basic-auth');
var bcrypt = require('bcrypt');

function authenticate(req, res, next) {

	// Authenticate using basic-auth first
	if (auth(req)) {
		
		var userCred = auth(req);

		// check email in the database
		User.findOne({ 
			emailAddress: userCred.name
		}).exec(function(err, user) {
			if (error) {
				return next(err);
			} else if (!user) {
				var error = new Error('Sorry, User not found');
	          	error.status = 401;
	          	return next(err);
			}

			// Now check the user password
	        bcrypt.compare(userCred.pass, user.password, function(err, result) {

	        	if (error) {
	        		return next(err);
	        	} else if (result === true) {
	        		// User added to request object as req.user
	        		req.user = user;

	        		return next();
	        	} else {
	        		var error = new Error('Password is not matching');
	          		error.status = 401;
	          		return next(err);
	        	}
	        
	        }); // end bcrypt function

		}); // ends findOne

	} else {
		var err = new Error('Sorry, you are not authorized');
		err.status = 404;
		return next(err);
	}

}

module.exports.authenticate = authenticate;
