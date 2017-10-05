'use strict';
console.log('log a');
// load modules
var express = require('express');
var morgan = require('morgan');
var jsonParser = require('body-parser').json;
var mongoose = require('mongoose');
var session = require('express-session');
var seeder = require('mongoose-seeder');
var seedData = require('../data/data.json');
var users = require('../routes/users');
var courses = require('../routes/courses');
var login = require('../routes/login');

var app = express();

// use sessions for tracking logins
app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false
}));

// morgan gives us http request logging
app.use(morgan('dev'));

// parse incoming requests
app.use(jsonParser());
// app.use(jsonParser.urlencoded({
//   extended: true
// }));

app.use(function(req, res, next){
  console.log("First piece of middleware");
  next();
});

// set our port
app.set('port', process.env.PORT || 5000);

mongoose.connect('mongodb://localhost:27017/courseRating', { useMongoClient: true });

var db = mongoose.connection;

db.on('error', function(err){
    console.error('connection error:', err);
});


// Run this to seed your database then comment out
db.once('open', function(){
  console.log('db connection successful');
  seeder.seed(seedData, { dropDatabase: true})
    .then(function() {
      console.log('Database Seeded');
    })
    .catch(function(err) {
      console.error('database seed error: ', err);
    });
});    

// setup our static route to serve files from the "public" folder
app.use('/static', express.static(__dirname +'/public'));

// setup our views
app.set('view engine', 'pug');  
app.set('views', __dirname + '/public/templates'); //Use __dirname since we
//sometimes run with a nodemon command with a path to the server.js file.

// routes handling
app.use('/api/users', users);
app.use('/api/courses', courses);
app.use('/api/course', course);
app.use('/api/login', login);


// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
      error: {
          message: err.message
      }
  }); 
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});

module.exports = app;