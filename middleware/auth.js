'use strict';

var auth = require('basic-auth');
var bcrypt = require('bcrypt');

function authenticate(req, res, next) {
	console.log('log authenticate function in middleware');
    var credentials = auth(req);
    console.log(credentials);

	// Authenticate using basic-auth first
	if (credentials) {
		console.log('log auth(req) check');
		var userCred = auth(req);

		// check email in the database
		User.findOne({ 
			emailAddress: userCred.name
		}).exec(function(err, user) {
			if (err) {
				return next(err);
			} else if (!user) {
				var err = new Error('Sorry, User Name not found');
	          	err.status = 401;
	          	return next(err);
			}

			// Now check the user password
	        bcrypt.compare(userCred.pass, user.password, function(err, result) {

	        	if (err) {
	        		return next(err);
	        	} else if (result === true) {
	        		// User added to request object as req.user
	        		// Alternatively,You could do it this way using session
	        		// req.session.user = user;
	        		req.user = user;
                    return next();
	        		// return next();
	        	} else {
	        		var err = new Error('Password does not match User Name');
	          		err.status = 401;
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
