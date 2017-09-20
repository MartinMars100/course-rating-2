'use strict';
console.log('log a');
// load modules
var express = require('express');
var morgan = require('morgan');
var jsonParser = require('body-parser').json;
var routes = require('../routes');
var app = express();
var mongoose = require('mongoose');
var seeder = require('mongoose-seeder');
var seedData = require('../data/data.json');

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
// app.use('/api/users', users);
app.use('/api/users', routes);
// app.use('/api/courses', courses);


// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});