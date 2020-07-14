const mongoose = require('mongoose');
const MONGODB_URI =
	'mongodb+srv://timothy:yJ51plVHGzphoFGx@express-ecommerce.0mskm.mongodb.net/express-ecommerce?retryWrites=true&w=majority' ||
	'mongodb://localhost:27017/user-auth';

mongoose
	.connect(MONGODB_URI, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Mongoose successfully connected'))
	.catch((err) => console.log(err));

module.exports = {
	User: require('./User'),
	Products: require(`./Products`),
	productsArr: require('./productsArr'),
};
