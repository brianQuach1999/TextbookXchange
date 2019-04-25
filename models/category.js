const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
	category: {
				type: String, 
				enum: ["Science","Math","History","Arts","English","Computer Science","Psychology"]
			},	
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };