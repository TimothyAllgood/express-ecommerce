// current path: /products

// show
require('dotenv').config();
console.log(process.env.CLOUD_KEY);
const express = require('express');
const router = express.Router();
const db = require('../models');
const methodOverride = require(`method-override`);
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
	cloudinary: cloudinary,
	params: {
		folder: 'ecommerce',
		format: async (req, file) => 'png', // supports promises as well
		public_id: (req, file) => file.path,
	},
});

const upload = multer({ storage: storage });

// CURRENT PATH: /products

router.use(methodOverride(`_method`));
// get requests ------------------------------- ROUTE TO INDEX
router.get(`/`, (req, res) => {
	// step one: get the data
	db.Products.find({}, (err, allProducts) => {
		if (err) return console.log(err);
		res.render(`products/index`, {
			products: allProducts,
		});
	});
});
// ---------------------------------- GO TO CREATE PRODUCT PAGE  ---------------------------------------------//
// this product route needs to go before :index one or else index will think new is an index
// form page to create new products
router.get(`/create`, (req, res) => {
	res.render(`products/create`);
});
// ---------------------------------- CREATE Product  ---------------------------------------------/
router.post(`/`, upload.single('img'), (req, res) => {
	const file = req.file;
	let path = 'https://picsum.photos/150/150';
	if (file) {
		path = file.path;
		cloudinary.uploader.upload(file.path, function (result) {
			console.log(file);
		});
	}
	const productInfo = {
		name: req.body.name,
		description: req.body.description,
		price: req.body.price,
		category: req.body.category,
		createdBy: req.body.createdBy,
		img: path,
	};

	db.Products.create(productInfo, (err, newProduct) => {
		if (err) return console.log(err);

		res.redirect(`/products`);
	});
});

// ---------------------------------- SHOW SINGLE PRODUCT  ---------------------------------------------//
// single route to product to show
router.get('/:id', function (req, res) {
	if (req.session.userId) {
		db.User.findByIdAndUpdate(
			// Push item into User recent array when page is viewed
			req.session.userId,
			{
				$push: { recent: { $each: [req.params.id], $slice: -3 } },
			},
			{ new: true },
			(err, user) => {
				if (err) console.log(err);
				db.Products.findById(req.params.id, (errTwo, foundProduct) => {
					if (errTwo) return console.log(errTwo);

					res.render('products/show.ejs', {
						//second param must be an object
						product: foundProduct,
					});
				});
			}
		);
	} else {
		db.Products.findById(req.params.id, (err, foundProduct) => {
			if (err) return console.log(err);

			res.render('products/show.ejs', {
				//second param must be an object
				product: foundProduct,
			});
		});
	}
});

// ---------------------------------- SHOW ALL PRODUCTS  ---------------------------------------------//
// route to show all products using render
// Shows All Users

//edit route and update routes, when using edit, its the same route as delete :index or :id so can be tricky
/* PATCH or PUT are two different methods, we can use either one, patch uses one piece, put updates everything and also says if this record exists i wanna update it, if it doesnt, i want to create it. PUT is safer to use than patch when updating/editing */

// ---------------------------------- UPDATE  ---------------------------------------------//

// EDIT PRODUCT(PART ONE) go to edit page:
router.get(`/:id/edit`, (req, res) => {
	db.Products.findById(req.params.id, (err, foundProducts) => {
		if (err) return console.log(err);
		res.render(`products/edit`, {
			product: foundProducts,
		});
	});
});

// (also needs method override like delete) EDIT PRODUCT (PART TWO: UPDATE) send update/edit:
// this time instead of ?_method=DELETE we use ?_method=PUT
router.put(`/:id/edit`, (req, res) => {
	db.Products.findByIdAndUpdate(
		req.params.id,
		req.body,
		{ new: true },
		(err, foundProducts) => {
			if (err) return console.log(err);
			res.redirect(`/products`);
		}
	);
});

// ---------------------------------- DELETE  ---------------------------------------------//
// delete one product (destroy) route - uses method overrride
router.delete('/:id', (req, res) => {
	db.Products.findByIdAndDelete(req.params.id, (err, deletedProducts) => {
		if (err) return console.log(err);

		res.redirect('/products');
	});
});

// ------------------------------------------- REVIEWS

router.put('/:id/addReview/:name', (req, res) => {
	console.log(req.body);
	db.Products.findByIdAndUpdate(
		req.params.id,
		{
			$push: {
				reviews: {
					review: req.body.review,
					author: req.params.name,
					rating: req.body.ratingquality,
				},
			},
		},
		{ new: true },
		(err, updatedProduct) => {
			if (err) console.log(err);
			res.redirect(`/products/${updatedProduct._id}`);
		}
	);
});

module.exports = router;
