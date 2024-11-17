//import and setting up middleware
var express = require("express"); //call express
var app = express(); //define our app using express

const mongoose = require("mongoose");
const Restaurant = require("./restaurant");
mongoose.connect("mongodb+srv://mizannoor:1q2w3e4r@cluster0.jhf6z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var port = process.env.PORT || 8080; //set our port
//Setting route and path
var router = express.Router();
router.get("/", async (req, res) => {
	res.json({ message: "Hula! my API works!!!" });
});

app.use("/api", router);
app.listen(port); // create a server that browsers can connect to
console.log("Magic happened at port " + port);

// Create
router.post("/restaurants", async (req, res) => {
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
			res.json({ message: "Restaurant successfully created!" });
		})
		.catch((err) => {
			res.json({ error: "message" + err });
		});
});
// Read all
router.get("/restaurants", async (req, res) => {
	Restaurant.find()
		.then(function (restaurants) {
			res.json({ message: "OK", data: restaurants });
		})
		.catch(function (err) {
			res.json({ error: "message " + err });
		});
});

// Read one
router.get("/restaurants/:id", async (req, res) => {
	Restaurant.findById(req.params.id)
		.then((restaurant) => {
			res.json({ message: "OK", data: restaurant });
		})
		.catch((err) => {
			if (err) res.json({ error: "message " + err });
		});
});
// Update
router.put("/restaurants/:id", async (req, res) => {
	Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true })
		.then((restaurant) => {
			res.json({ message: "Restaurant updated sucessfully", data: restaurant });
		})
		.catch((err) => {
			res.json({ error: "message " + err });
		});
});
// Delete
router.delete("/restaurants/:id", async (req, res) => {
	Restaurant.findByIdAndDelete(req.params.id)
		.then((restaurtant) => {
			res.json({ message: "Restaurant deleted successfully " + req.params.id });
		})
		.catch((err) => {
			res.json({ error: "message " + err });
		});
});

//! Exercise

router.post("/restaurants/:id/menus", async (req, res) => {
	// use push() to appends a specified value to an array (menu)
	// restaurant.menus.push(newMenu)
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		restaurant.menus.push(req.body); //? POST eg: { name, description, price, imageUrl }
		await restaurant.save();

		res.json({ message: "OK", data: restaurant.menus });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.get("/restaurants/:id/menus", async (req, res) => {
	// list all menus of a given restaurant id req.params.id
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		res.json({ message: "OK", data: restaurant.menus });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.get("/restaurants/:res_id/menus/:menu_id", async (req, res) => {
	// return menus document of a given id req.params.menu_id
	// var subDoc = restaurant.menus.id(req.params.menu_id);
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		const menu = restaurant.menus.id(req.params.menu_id);
		if (!menu) return res.status(404).send("Menu item not found");

		res.send({ message: "OK", data: menu });
	} catch (err) {
		res.status(500).send(err.message);
	}
});
router.put("/restaurants/:res_id/menus/:menu_id", async (req, res) => {
	// updates the menu while keeping its schema
	// menu.set(req.body);
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		const menu = restaurant.menus.id(req.params.menu_id);
		if (!menu) return res.status(404).send("Menu item not found");

		menu.set(req.body);
		await restaurant.save();
		res.send({ message: "OK", data: menu });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.delete("/restaurants/:res_id/menus/:menu_id", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		// Find the index of the menu item
		const menuIndex = restaurant.menus.findIndex((menu) => menu._id.toString() === req.params.menu_id);
		if (menuIndex === -1) return res.status(404).send("Menu item not found");

		// Remove the menu item
		restaurant.menus.splice(menuIndex, 1);
		await restaurant.save();

		res.send({ message: "OK", data: `Successfully deleted menu id ${req.params.menu_id}` });
	} catch (err) {
		res.status(500).send(err.message);
	}
});

router.post("/restaurants/:id/reviews", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		restaurant.reviews.push(req.body); //? POST eg: { rating, comment }
		await restaurant.save();

		res.json({ message: "OK", data: restaurant.reviews });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.get("/restaurants/:id/reviews", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		res.json({ message: "OK", data: restaurant.reviews });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.get("/restaurants/:res_id/reviews/:review_id", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		const review = restaurant.reviews.id(req.params.review_id);
		if (!review) return res.status(404).send("Review not found");

		res.send({ message: "OK", data: review });
	} catch (err) {
		res.status(500).send(err.message);
	}
});
router.put("/restaurants/:res_id/reviews/:review_id", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		const review = restaurant.reviews.id(req.params.review_id);
		if (!review) return res.status(404).send("Review not found");

		review.set(req.body);
		await restaurant.save();
		res.send({ message: "OK", data: review });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
router.delete("/restaurants/:res_id/reviews/:review_id", async (req, res) => {
	try {
		const restaurant = await Restaurant.findById(req.params.res_id);
		if (!restaurant) return res.status(404).send("Restaurant not found");

		// Find the index of the review
		const reviewIndex = restaurant.reviews.findIndex((review) => review._id.toString() === req.params.review_id);
		if (reviewIndex === -1) return res.status(404).send("Review not found");

		// Remove the review
		restaurant.reviews.splice(reviewIndex, 1);
		await restaurant.save();

		res.send({ message: "OK", data: `Successfully deleted review id ${req.params.review_id}` });
	} catch (error) {
		res.status(500).send(error.message);
	}
});
