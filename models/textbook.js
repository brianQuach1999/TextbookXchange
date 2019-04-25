const mongoose = require('mongoose');

const TextbookSchema = new mongoose.Schema({
	title: String,
	author: String,
	image: String,
	owner: {
			type: mongoose.Schema.Types.ObjectId, ref: 'User'
	},
	course: {
				type: String,
				match: /^[A-Z]{3,3}[1-4][0-9]{2,2}$/
			},
	category: {
				type: mongoose.Schema.Types.ObjectId, ref: 'Category'
			},
	description: String,
	price: Number
});

// Getter
TextbookSchema.path('price').get(function(num) {
  return (num / 100).toFixed(2);
});

// Setter
TextbookSchema.path('price').set(function(num) {
  return num * 100;
});

const Textbook = mongoose.model('Textbook', TextbookSchema);

module.exports = { Textbook };