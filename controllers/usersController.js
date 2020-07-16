const express = require('express');
const router = express.Router();
require('dotenv').config();
const db = require('../models');
const { update } = require('../models/User');

// Require This To Upload Images To Cloudinary found info on how to do at https://stackoverflow.com/questions/59376581/how-can-i-upload-image-to-cloudinary-using-multer-in-node-and-express-with-other
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Allows use of cloudinary
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ecommerce/users',
		format: async (req, file) => 'png', // supports promises as well
		public_id: (req, file) => file.path,
	},
});
// Multer Storage
const upload = multer({ storage: storage });

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
router.post('/', upload.single('img'), (req, res) => {
	const file = req.file; // uploaded image
	let path = 'https://picsum.photos/150/150'; // default image
	if (file) {
		// if there is an uploaded image upload to cloudinary
		path = file.path;
		cloudinary.uploader.upload(file.path, function (result) {
			console.log(file);
		});
	}
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
			req.session.error = 'A user with that email already exists.';
			res.redirect('/users/create');
		} else {
			// If user does not exist create User
			const userInfo = {
				email: req.body.email,
				password: req.body.password,
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				img: path,
				isAdmin: setAdmin(req.body.email),
			};
			db.User.create(userInfo, (err, createdUser) => {
				// Automatically logs user in after they create an account
				if (err) console.log(err);
				req.session.userId = createdUser._id; // Sets session userId to loggedIn userId
				req.session.email = createdUser.email; // Sets session email to loggedIn email
				req.session.name = createdUser.firstName + ' ' + createdUser.lastName;
				req.session.admin = createdUser.isAdmin; // Sets session admin status to loggedIn admin status
				req.session.img = createdUser.img;
				res.redirect(`/users/${createdUser._id}`);
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
	db.User.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, updatedUser) => {
			req.session.userId = updatedUser._id; // Sets session userId to loggedIn userId
			req.session.email = updatedUser.email; // Sets session email to loggedIn email
			req.session.name = updatedUser.firstName + ' ' + updatedUser.lastName;
			req.session.admin = updatedUser.isAdmin; // Sets session admin status to loggedIn admin status
			req.session.img = updatedUser.img;
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

// Displays Sign In Form
router.get('/signin', (req, res) => {
	req.body.email = null;
	res.render('user/signin');
});

// This route will set all the session info, signs user in

router.post('/signin', (req, res) => {
	db.User.findOne({ email: req.body.email }, (err, currentUser) => {
		if (err) console.log(err);

		if (currentUser) {
			// If user exists
			if (currentUser.password === req.body.password) {
				req.session.error = null;
				// Checks if password matches password for user in database
				req.session.userId = currentUser._id; // Sets session userId to loggedIn userId
				req.session.email = currentUser.email; // Sets session email to loggedIn email
				req.session.name = currentUser.firstName + ' ' + currentUser.lastName;
				req.session.admin = currentUser.isAdmin; // Sets session admin status to loggedIn admin
				req.session.length = currentUser.cart.length; // Cart Length
				req.session.img = currentUser.img;

				res.redirect(`/users/${req.session.userId}`); // Redirects to logged in users page
			} else {
				// If password doesn't match
				req.session.error = 'Incorrect Password'; // Error message when password doesn't match
				res.redirect('/users/signin');
			}
		} else {
			// If user does not exist
			req.session.error = 'Incorrect Username'; // Error message when no user found
			res.redirect('/users/signin');
		}
	});
});
// Show Individual User

router.get('/:id', (req, res) => {
	db.User.findById(req.params.id, (err, foundUser) => {
		let recentItems = foundUser.recent;
		db.Products.find(
			// Query products collection to display the items in users recent items array
			{
				_id: { $in: [recentItems[0], recentItems[1], recentItems[2]] }, // Show the recent items
			},
			(err, items) => {
				res.render('user/show', {
					user: foundUser,
					items,
				});
			}
		);
	});
});
// Add Admin Rights - Admins will be able to make any non admin users into admins
router.put('/:id/admin', (req, res) => {
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
	req.session.img = null;

	res.redirect('/');
});

// Cart
// Adds Item To User Cart
router.put('/:id/addToCart/:name&:price&:productId', (req, res) => {
	db.User.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				// Pushes product info from params into logged in user's cart
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
			req.session.length++; // Increments Cart Length for display purposes
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
			req.session.length--; // Decrements Cart Length for display purposes
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
