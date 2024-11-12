//import and setting up middleware
var express = require('express'); //call express
var app = express(); //define our app using express

const mongoose = require('mongoose');
const Restaurant = require('./restaurant');
mongoose.connect('mongodb+srv://mizannoor:1q2w3e4r@cluster0.djg3s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var port = process.env.PORT || 8080; //set our port
//Setting route and path
var router = express.Router();
router.get('/', (req, res) => {
	res.json({ message: 'Hula! my API works!!!' });
});

app.use('/api', router);
app.listen(port); // create a server that browsers can connect to
console.log('Magic happened at port ' + port);

// Create
router.post('/restaurants', (req, res) => {
	let newRestaurant = new Restaurant({
		name: req.body.name,
		address: req.body.address,
		email: req.body.email,
		phone: req.body.phone,
		description: req.body.description,
		opening_time: req.body.opening_time,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		types: req.body.types,
	});
	//method save by mongoose to store newRestaurant model data in db
	newRestaurant
		.save()
		.then(() => {
			res.json({ message: 'Restaurant succesfully created!' });
		})
		.catch((err) => {
			res.json({ error: 'message' + err });
		});
});
// Read all
router.get('/restaurants', (req, res) => {
	Restaurant.find()
		.then(function (restaurants) {
			res.json({ message: 'OK', data: restaurants });
		})
		.catch(function (err) {
			res.json({ error: 'message ' + err });
		});
});

// Read one
router.get('/restaurants/:id', (req, res) => {
	Restaurant.findById(req.params.id)
		.then((restaurant) => {
			res.json({ message: 'OK', data: restaurant });
		})
		.catch((err) => {
			if (err) res.json({ error: 'message ' + err });
		});
});
// Update
router.put('/restaurants/:id', (req, res) => {
	Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((restaurant) => {
			res.json({ message: 'Restaurant updated sucessfully', data: restaurant });
		})
		.catch((err) => {
			res.json({ error: 'message ' + err });
		});
});
// Delete
router.delete('/restaurants/:id', (req, res) => {
	Restaurant.findByIdAndDelete(req.params.id)
		.then((restaurtant) => {
			res.json({ message: 'Restaurant deleted successfully ' + req.params.id });
		})
		.catch((err) => {
			res.json({ error: 'message ' + err });
		});
});

//! Exercise

router.post('/restaurants/:id/menus', (req, res) => {
	// use push() to appends a specified value to an array (menu)
	// restaurant.menus.push(newMenu)
  
});
router.get('/restaurants/:id/menus', (req, res) => {});
router.get('/restaurants/:res_id/menus/:menu_id', (req, res) => {
	// return menus document of a given id req.params.menu_id
	// var subDoc = restaurant.menus.id(req.params.menu_id);
});
router.put('/restaurants/:res_id/menus/:menu_id', (req, res) => {
	// updates the menu while keeping its schema
	// menu.set(req.body);
});
router.delete('/restaurants/:res_id/menus/:menu_id', (req, res) => {});
router.post('/restaurants/: id /reviews', (req, res) => {});
router.get('/restaurants/: id /reviews', (req, res) => {});
router.get('/restaurants/:res_id/reviews/:review_id', (req, res) => {});
router.put('/restaurants/:res_id/reviews/:review_id', (req, res) => {});
router.delete('/restaurants/:res_id/reviews/:review_id', (req, res) => {});
