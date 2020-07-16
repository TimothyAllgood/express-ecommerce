const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email: { type: String, required: true },
	password: { type: String, required: true },
	firstName: { type: String, default: 'First' },
	lastName: { type: String, default: 'Last' },
	img: String,
	isAdmin: Boolean,
	cart: [{}],
	recent: [],
});

const User = mongoose.model('User', userSchema);

module.exports = User;

// TODO
// Add Validation
// Add Cart
