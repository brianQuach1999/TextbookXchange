/* E4 server.js */
'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser') // middleware for parsing HTTP body from client
const session = require('express-session')
const hbs = require('hbs')
const multer = require('multer');

const { ObjectID } = require('mongodb')

// Mongoose
const { mongoose } = require('./db/mongoose');
const { User } = require('./models/user')
const { Category } = require('./models/category')
const { Textbook } = require('./models/textbook')

const mongoosejs = require('mongoose');



// Express
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
const app = express();
// body-parser middleware setup.  Will parse the JSON and convert to object
app.use(bodyParser.json());
// parse incoming parameters to req.body
app.use(bodyParser.urlencoded({ extended:true }))
// for file uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'img/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
const upload = multer({storage: storage})





// set the view library
app.set('view engine', 'hbs')

// static js directory
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/images", express.static(__dirname + '/public/images'))
app.use("/img", express.static(__dirname + '/img'))

//SESSION MANAGEMENT
//	COPIED FROM LECTURE PLEASE ADAPT

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true,
	},
}))

// Update the session cookie with the user data
const verifyCredentials = (data, req, res) => {
	User.findByUsernamePassword(data.username, data.password).then((user) => {
		if(!user) {
			res.redirect('/login');
		} else {
			// Add the user to the session cookie that we will
			// send to the client
			req.session.user = user._id;
			req.session.username = user.username
			req.session.type = user.type
			req.session.cart = user.cart

			res.redirect('/profile')
		}
	}).catch((error) => {
		console.log(error);
		res.status(400).redirect('/login')
	})
}

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('/profile')
	} else {
		next();
	}
}

// Middleware for authentication for resources
const authenticate = (req, res, next) => {
	if (req.session.user) {
		User.findById(req.session.user).then((user) => {
			if (!user) {
				return Promise.reject()
			} else {
				req.user = user
				next()
			}
		}).catch((error) => {
			res.redirect('/login')
		})
	} else {
		res.redirect('/login')
	}
}


//ROUTES
// route for index
app.get('/', (req, res) => {
	log("Rendering index");
	if (!req.session.user) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
	}
	const session = {session: JSON.stringify(req.session)};
	res.render('index.hbs', session)
})

app.get('/login', sessionChecker, (req, res) => {
	log("Rendering login");
	if (!req.session.user) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
	}
	const session = {session: JSON.stringify(req.session)};
	res.render('login.hbs', session)
})

app.get('/cart', (req, res) => {
	log("Rendering cart");
	if (!req.session.user) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
	}
	const session = {session: JSON.stringify(req.session)};
	res.render('cart.hbs', session)
})

app.get('/textbook', (req, res) => {
	log("Rendering textbook");
	if (!req.session.user) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
	}
	const session = {session: JSON.stringify(req.session)};
	res.render('product-page.hbs', session)
})

app.get('/search', (req, res) => {
	log("Rendering search");
	if (!req.session.user) {
		if (!req.session.cart) {
			req.session.cart = [];
		}
	}
	const session = {session: JSON.stringify(req.session)};
	res.render('search.hbs', session)
})

app.get('/profile', (req, res) => {
	log("Rendering profile");
	if (req.session.user) {
		const session = {session: JSON.stringify(req.session)};
		if (req.session.type == "Admin") {
			res.render('admin.hbs', session)
		} else {
			res.render('user.hbs', session)
		}
	} else {
		if (!req.session.cart) {
			req.session.cart = [];
		}
		res.redirect('/login')
	}
})

app.patch('/cart', (req, res) => {
	log("Updating session cart");
	req.session.cart = req.body.cart;
	res.send(req.session);
})


//USERS
//GET all users who match query
app.get('/users', (req, res) => {
	User.find(req.query).then((users) => {
		if (!users) {
			res.status(404).send()
		} else {
			res.send(users)

		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//GET user by id
app.get('/users/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	User.findById(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//POST user
app.post('/users', (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
		type: req.body.type
	})
		
	const duplicateCheck = {};
	duplicateCheck.username = req.body.username;
	
	User.findOne(duplicateCheck).then((duplicate) => {
		if(!duplicate) {
			user.save().then((result) => {
				const data = {}
				data.username = req.body.username
				data.password = req.body.password
				verifyCredentials(data, req, res)
			})
		} else {
			res.status(409).send() //username already exists
		}
	}, (error) => {
		res.status(400).send(error)
	}).catch((error) => {
		res.status(500).send()
	})
})

//PATCH a user by id
app.patch('/users/:id', (req, res) => {
	const id = req.params.id

	const body = {};
	if (req.body.username) {
		body.username = req.body.username;
	}
	if (req.body.password) {
		body.password = req.body.password;
	}
	if (req.body.type) {
		body.type = req.body.type;
	}
	if (req.body.cart) {
		body.cart = req.body.cart;
	}
	if (req.body.wishlist) {
		body.wishlist = req.body.wishlist;
	}

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	User.findByIdAndUpdate(id, {$set: body}, {new: true}).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//DELETE a user by id
app.delete('/users/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}
	
	User.findByIdAndDelete(id).then((user) => {
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//POST user login
app.post('/users/login', (req, res) => {
	const data = {};
	data.username = req.body.username;
	data.password = req.body.password;
	verifyCredentials(data, req, res);	
})

//GET user logout
app.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			consol.log("oops");
			res.status(500).send(error)
		} else {
			console.log("logged out", req.session);
			res.redirect('/')
		}
	})
})


//CATEGORIES
//GET all categories who match query
app.get('/categories', (req, res) => {
	Category.find(req.query).then((categories) => {
		if (!categories) {
			res.status(404).send()
		} else {
			res.send(categories)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//GET category by id
app.get('/categories/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	Category.findById(id).then((category) => {
		if (!category) {
			res.status(404).send()
		} else {
			res.send(category)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//POST category
app.post('/categories', (req, res) => {
	const category = new Category({
		category: req.body.category,
	})

	category.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error)
	}).catch((error) => {
		res.status(500).send()
	})
})

//PATCH a category by id
app.patch('/categories/:id', (req, res) => {
	const id = req.params.id

	const body = {};
	if (req.body.category) {
		body.category = req.body.category;
	}

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	Category.findByIdAndUpdate(id, {$set: body}, {new: true}).then((category) => {
		if (!category) {
			res.status(404).send()
		} else {
			res.send(category)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//DELETE a category by id
app.delete('/categories/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}
	
	Category.findByIdAndDelete(id).then((category) => {
		if (!category) {
			res.status(404).send()
		} else {
			res.send(category)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})


//TEXTBOOKS
//GET all textbooks who match query
//	Query limited to category (exact), course (contains, case-insensitive), title (contains, case-insensitive)
app.get('/textbooks', (req, res) => {
	const query = {};
	if (req.query.category && req.query.category != "") {
		query.category = mongoosejs.Types.ObjectId(req.query.category);
	}
	if (req.query.course) {
		query.course = { "$regex": req.query.course, "$options": "i" };
	}
	if (req.query.title) {
		query.title = { "$regex": req.query.book, "$options": "i" };
	}
	if (req.query.owner) {
		query.owner = mongoosejs.Types.ObjectId(req.query.owner);
	}
	log(query);
	Textbook.find(query)
	.then((textbooks) => {
		if (!textbooks) {
			res.status(404).send()
		} else {
			res.send(textbooks)

		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//GET textbook by id
app.get('/textbooks/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	Textbook.findById(id).then((textbook) => {
		if (!textbook) {
			res.status(404).send()
		} else {
			res.send(textbook)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//POST textbook
app.post('/textbooks', (req, res) => {
		
	const textbook = new Textbook({
		title: req.body.title,
		author: req.body.author,
		image: req.body.image,
		owner: req.body.owner,
		course: req.body.course,
		category: req.body.category,
		description: req.body.description,
		price: req.body.price
	})

	textbook.save().then((result) => {
		res.send(result)
	}, (error) => {
		res.status(400).send(error)
	}).catch((error) => {
		res.status(500).send()
	})
})

//PATCH a textbook by id
app.patch('/textbooks/:id', (req, res) => {
	const id = req.params.id

	const body = {};
	if (req.body.title) {
		body.title = req.body.title;
	}
	if (req.body.author) {
		body.author = req.body.author;
	}
	if (req.body.image) {
		body.image = req.body.image;
	}
	if (req.body.owner) {
		body.owner = mongoosejs.Types.ObjectId(req.body.owner);
	}
	if (req.body.course) {
		body.course = req.body.course;
	}
	if (req.body.category) {
		body.category = mongoosejs.Types.ObjectId(req.body.category);
	}
	if (req.body.description) {
		body.description = req.body.description;
	}
	if (req.body.price) {
		body.price = req.body.price;
	}

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}

	Textbook.findByIdAndUpdate(id, {$set: body}, {new: true}).then((textbook) => {
		if (!textbook) {
			res.status(404).send()
		} else {
			res.send(textbook)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

//DELETE a textbook by id
app.delete('/textbooks/:id', (req, res) => {
	const id = req.params.id

	if (!ObjectID.isValid(id)) {
		res.status(404).send()
	}
	
	Textbook.findByIdAndDelete(id).then((textbook) => {
		if (!textbook) {
			res.status(404).send()
		} else {
			res.send(textbook)
		}
	}).catch((error) => {
		res.status(500).send()
	})
})

app.post('/upload', upload.single('image'), (req, res, next) => {
	console.log(req.file);
	const file = req.file;
	
	res.send(file);
})

//////////

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
