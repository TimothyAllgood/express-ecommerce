const express = require('express'); // require express
const app = express(); // set app as express
const session = require('express-session'); // require express session for middleware
const methodOverride = require('method-override'); // require method override for full CRUD functionality
const productsController = require(`./controllers/productsController`); // require products controller for product routes
const db = require('./models');
const mongoose = require(`mongoose`);
const usersController = require('./controllers/usersController'); // user controller for user routes
const productsArr = require('./models/productsArr');
const PORT = process.env.PORT || 4000; // set port
app.set('view engine', 'ejs'); // set a view engine, ejs to display and render

app.use(express.static(__dirname + '/public')); // for css and images
// Method Override
app.use(methodOverride('_method')); // set our method override

// Express BodyParser
app.use(express.urlencoded({ extended: false })); // body parser for req feedback

// Express Session
app.use(
  session({
    secret: 'keyboard cat', // i dont know some kind of cat? meow
    resave: false,
    saveUninitialized: true,
  })
);

// Sets EJS Variables - Can call these from any ejs view using the varibale name eq, app.locals.title => title on ejs view
app.use((req, res, next) => {
  // Logged In User Info available anywhere
  app.locals.userId = req.session.userId;
  app.locals.username = req.session.username;
  app.locals.admin = req.session.admin;
  next();
});

// Custom Middleware
// Sets Title Dynamically
app.use((req, res, next) => {
  app.locals.title = req.url.replace('/', '| '); // Sets title to url replacing / with |
  next();
});
// populate db
/* db.Products.collection.insertMany(productsArr, (err, data) => {
  console.log("added provided products data")
  mongoose.connection.close();
}); */
// Routes
// Index Route

app.get('/', (req, res) => {
  res.render('index');
});
app.use(`/products`, productsController);
app.use('/users', usersController);

app.get(`*`, (req, res) => {
  res.render(`404`, {
    req: req.url,
  });
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
