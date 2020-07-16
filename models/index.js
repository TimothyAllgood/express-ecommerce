const mongoose = require('mongoose');
require('dotenv').config();
const MONGODB_URI =
	process.env.MONGODB_URL || 'mongodb://localhost:27017/user-auth';

mongoose
	.connect(MONGODB_URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Mongoose successfully connected: ', MONGODB_URI))
	.catch((err) => console.log(err));

module.exports = {
	User: require('./User'),
	Products: require(`./Products`),
	productsArr: require('./productsArr'),
};
