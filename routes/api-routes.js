// Requiring our Note and Article models
var Note = require("./../models/Note.js");
var Article = require("./../models/Article.js");


// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");


module.exports = function (app) {

	app.post("/save", function(req, res) {
		Article.update({_id: req.query.id}, {
			saved: true
		}, function(err, affected, res) {
			console.log(res);
		});
	});

	app.post("/drop", function(req, res) {
		Article.update({_id: req.query.id}, {
			saved: false
		}, function(err, affected, res) {
			console.log(res);
		});
	});

	app.get("/", function(req, res) {
		Article.find({}, null, {sort:{_id: -1}}, function(error, doc) {
			console.log(doc);
			if (error) {
				console.log(error);
			}
				else if (doc.length === 0) {
					res.render("noArticles");
				}
					else {
						res.render("index", {
							"articleList": doc
						});
					}
		});
	});

	app.get("/saved", function(req, res) {
		Article.find({"saved": true}, function(error, doc) {
			console.log(doc);
			if (error) {
				console.log(error);
			}
				else if (doc.length === 0) {
					res.render("noSaved");
				}
					else {
						res.render("saved", {
							"articleList": doc
						});	
					}
		});
	});

	app.get("/saved/:id", function(req, res) {
		// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
		Article.findOne({ "_id": req.params.id })
		// ..and populate all of the notes associated with it
		.populate("note")
		// now, execute our query
		.exec(function(error, doc) {
		// Log any errors
			if (error) {
				console.log(error);
			}
			// Otherwise, send the doc to the browser as a json object
				else {
					res.json(doc);
				}
		});
	});

	// Create a new note or replace an existing note
	app.post("/saved/:id", function(req, res) {
		// Create a new note and pass the req.body to the entry
		console.log(req.body);
		var newNote = new Note(req.body);
	
		// And save the new note the db
		newNote.save(function(error, doc) {
		// Log any errors
			if (error) {
				console.log(error);
			}
			// Otherwise
				else {
					// Use the article id to find and update it's note
					Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
					// Execute the above query
					.exec(function(err, doc) {
					// Log any errors
						if (err) {
							console.log(err);
						}
							else {
								// Or send the document to the browser
								res.send(doc);
							}
					});
				}
		});
	});

	
	app.get("/scrape", function(req, res) {
		var newArticles = 0;
		console.log("I'm in Scrape");
		request("http://www.towleroad.com/", function(error, response, html) {
			console.log("I'm in request");
			var $ = cheerio.load(html);
			$("article").each(function(i, element) {
				var result = {};

				result.title = $(element).find("h2.entry-title").text();
				result.link = $(element).find("a").attr("href");
				var preSummary = $(element).find("p").first().text();
				result.summary = preSummary.slice(0, preSummary.indexOf(" Read"));
				var preByline = $(element).find("p.entry-meta").text();
				result.byline = preByline.slice(3, preByline.indexOf(" |"));
				var preImage = $(element).find(".entry-image").attr("srcset");
				result.image = preImage.slice(0, preImage.indexOf("?"));
				console.log("My result is");
				
				var entry = new Article(result);
				// Now, save that entry to the db
				entry.save(function(err, doc) {
				// Log any errors
					if (err) {
						if (err.message.indexOf("duplicate key")) {
						console.log("duplicate entry");
						}
							else {
								console.log(err);
							}
					}
					// Or log the doc
						else {
							newArticles++;
							console.log(doc);
						}
				});
			});
		});
		Article.find({}, null, {sort:{_id: -1}}, function(error, doc) {
			if (error) {
				console.log(error);
			}
				else if (newArticles > 0) {
					res.render("index", {
						"articleList": doc,
						"newArticles": newArticles
					});
				}
					else {
						res.render("noNewArticles", {
							"articleList": doc
						});
					}
		});
	});
}