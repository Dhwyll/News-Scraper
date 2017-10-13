// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
	// title is a required string
	title: {
		type: String,
		required: true,
		unique: true
	},
	// link is a required string
	link: {
		type: String,
		required: true,
		unique: true
	},
	// summary is a required string
	summary: {
		type: String,
		required: true
	},
	// byline is a required string
	byline: {
		type: String,
		required: true
	},
	image: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		required: true,
		default: false
	},
	// This only saves one note's ObjectId, ref refers to the Note model
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;