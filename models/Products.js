const mongoose = require(`mongoose`);

const productSchema = new mongoose.Schema({
	name: String,
	description: String,
	price: Number,
	date: {
		type: Date,
		default: new Date().toLocaleDateString(),
	},
	img: { type: String, default: 'https://picsum.photos/150/150' },
	createdBy: String,
	category: Array,
	reviews: [
		{
			review: String,
			author: String,
			rating: Number,
		},
	],
});

const Products = new mongoose.model(`Products`, productSchema);
module.exports = Products;
