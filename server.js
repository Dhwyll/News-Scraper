// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();
// Set up an Express Router
var router = express.Router();

// Set up the port
var PORT = process.env.PORT || 3000;


// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
	extended: false
}));


// Make public a static dir
app.use(express.static(__dirname + "/public"));



// If deployed, use the deployed database. Otherwise use the local news-scraper database
var db = process.env.MONGODB_URI || "mongodb://localhost/news-scraper";

// Connect mongoose to our database
mongoose.connect(db, function(error) {
  // Log any errors connecting with mongoose
  if (error) {
    console.log(error);
  }
  // Or log a success message
  else {
    console.log("mongoose connection is successful");
  }
});


// Routes
// =================================================================
require( './routes/api-routes.js' )( router );
// Have every request go through our router middleware
app.use(router);



// Set handlebars.
var exphbs = require( 'express-handlebars' );

app.engine( 'handlebars', exphbs( { 'defaultLayout': 'main' } ) );
app.set( 'view engine', 'handlebars' );


// Listen on port 3000
app.listen(PORT, function() {
	console.log("App running on port 3000!");
});