const express = require('express');
const router = express.Router();

const db = require('../models');
const { update } = require('../models/User');

// Shows All Users
router.get('/', (req, res) => {
	db.User.find({}, (err, foundUsers) => {
		if (err) console.log(err);
		res.render('user/index', {
			users: foundUsers,
		});
	});
});

// Displays sign up form
router.get('/create', (req, res) => {
	res.render('user/create');
});

// Creates new user (sign up)
router.post('/', (req, res) => {
	// Checks If User already Exists
	// Sets admin by default to false, true if any of these email addresses are submitted
	function setAdmin(adminValue) {
		const adminCheck = {
			'dzag17188@gmail.com': true,
			'timothyallgood@gmail.com': true,
			'@generalassemb.ly': true,
			default: false,
		};
		if (adminValue.includes('@generalassemb.ly')) {
			adminCheck[adminValue] = true;
		}

		return adminCheck[adminValue] || adminCheck['default'];
	}
	db.User.findOne({ email: req.body.email }, (err, existingUser) => {
		if (err) console.log(err);
		if (existingUser) {
			// If user exists do this
			res.redirect('/users/create');
		} else {
			// If user does not exist create User
			const userInfo = {
				email: req.body.email,
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				isAdmin: setAdmin(req.body.email),
			};
			db.User.create(userInfo, (err, createdUser) => {
				if (err) console.log(err);
				res.redirect('/');
			});
		}
	});
});

// Displays user update form
router.get('/edit/:id', (req, res) => {
	db.User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err);
		res.render('user/edit', { user: foundUser });
	});
});

// Edits User
router.put('/:id', (req, res) => {
	// Checks If User already Exists
	db.User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			req.session.userId = updatedUser._id; // Sets session userId to loggedIn userId
			req.session.email = updatedUser.email; // Sets session email to loggedIn email
			req.session.name = updatedUser.firstName + ' ' + updatedUser.lastName;
			req.session.admin = updatedUser.isAdmin; // Sets session admin status to loggedIn admin status
			if (err) console.log(err);
			res.redirect(`/users/${updatedUser._id}`);
		}
	);
});

// Displays user update form
router.get('/edit/:id', (req, res) => {
	db.User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err);
		res.render('user/edit', { user: foundUser });
	});
});

// Edits User
router.put('/:id', (req, res) => {
	// Checks If User already Exists
	db.User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			req.session.userId = updatedUser._id; // Sets session userId to loggedIn userId
			req.session.email = updatedUser.email; // Sets session email to loggedIn email
			req.session.name = updatedUser.firstName + ' ' + updatedUser.lastName;
			req.session.admin = updatedUser.isAdmin; // Sets session admin status to loggedIn admin status
			if (err) console.log(err);
			res.redirect(`/users/${updatedUser._id}`);
		}
	);
});

// Displays Sign In Form
router.get('/signin', (req, res) => {
	res.render('user/signin');
});

// This route will set all the session info, signs user in

router.post('/signin', (req, res) => {
	db.User.findOne({ email: req.body.email }, (err, currentUser) => {
		if (err) console.log(err);
		if (currentUser) {
			// If user exists
			if (currentUser.password === req.body.password) {
				// Checks if password matches password for user in database
				req.session.userId = currentUser._id; // Sets session userId to loggedIn userId
				req.session.email = currentUser.email; // Sets session email to loggedIn email
				req.session.name = currentUser.firstName + ' ' + currentUser.lastName;
				req.session.admin = currentUser.isAdmin; // Sets session admin status to loggedIn admin
				req.session.length = currentUser.cart.length; // Cart Length
				res.redirect(`/users/${req.session.userId}`); // Redirects to logged in users page
			} else {
				// If password doesn't match
				res.send('Wrong password');
			}
		} else {
			// If user does not exist
			res.send('No user found');
		}
	});
});
// Show Individual User

router.get('/:id', (req, res) => {
	db.User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err);
		res.render('user/show', {
			user: foundUser,
		});
	});
});

// Add Admin Rights
router.put('/:id', (req, res) => {
	// Finds user by id and updates isAdmin key to equal true
	db.User.findByIdAndUpdate(
		req.params.id,
		{ isAdmin: true },
		{ new: true },
		(err, adminUser) => {
			if (err) console.log(err);
			res.redirect(`/users/${adminUser._id}`);
		}
	);
});

// Log Out
// Sets all session data to null, logging current user out
router.post('/logout', (req, res) => {
	req.session.userId = null;
	req.session.email = null;
	req.session.name = null;
	req.session.admin = null;
	req.session.length = null;
	res.redirect('/');
});

// Cart
// Adds Item To User Cart
router.put('/:id/addToCart/:name&:price&:productId', (req, res) => {
	db.User.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				cart: {
					productName: req.params.name,
					productPrice: req.params.price,
					productId: req.params.productId,
				},
			},
		},
		{ new: true },
		(err, user) => {
			if (err) console.log(err);
			req.session.length++;
			res.redirect(`/users/${user._id}/cart`);
		}
	);
});

// Remove from User Cart
router.put('/:id/removeFromCart/:name', (req, res) => {
	db.User.findByIdAndUpdate(
		req.params.id,
		{
			$pull: { cart: { productName: req.params.name } },
		},
		{ new: true },
		(err, user) => {
			if (err) console.log(err);
			req.session.length--;
			res.redirect(`/users/${user._id}/cart`);
		}
	);
});

// Display User Cart
router.get('/:id/cart', (req, res) => {
	db.User.findById(req.params.id, (err, foundUser) => {
		if (err) console.log(err);
		res.render('user/cart', {
			user: foundUser,
			cartItems: foundUser.cart,
		});
	});
});

module.exports = router;
