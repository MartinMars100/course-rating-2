'use strict';

var express = require('express');
var app  = express();
var routes = require('./routes')

var jsonParser = require('body-parser').json;
var logger = require('morgan');

var port = process.env.PORT;

// require('database.js');

app.use(logger('dev'));
app.use(jsonParser());

app.use('/questions', routes)

//catch 404 and forward to error handler
app.use(function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.json({
      error: {
          message: err.message
      }
  });  
});

var port = process.env.PORT;

app.listen(port, function() {
    console.log("The Express Server is Running on port " + port);
});