var nmongo = require("./db/storeDB");
const mongo = require('mongodb');
var retrieveData = require("./db/retrieve");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
var assert = require('assert');
const session = require('express-session');
const passport = require('passport');
const engines = require('consolidate');
var fs = require("fs");
var express = require('express')
var bodyParser = require('body-parser');
const Contact = require('./models/contact');
const Store = require('./models/store');
const objectId = require('mongodb').ObjectID;
var app = express();
var port = 8000 ;
const Purchase = require('./models/newPurchase')

var server = app.listen(port, () => {
    console.log('server is listening on port', server.address().port)
})

const io = require('socket.io')(server);


require('./config/passport')(passport);

const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(errr));
	
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.post('/imInterested',(req,res) => {
	const location = req.body.location;
	const email = req.body.email;
	const price = req.body.price;

	const newPurchase = new Purchase({location, email, price});
	newPurchase.save().then(purchases => {
		res.send('Thank you for choosing us!');	
	}).catch(err => console.log(err));
		
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use('/chat', (req,res) => {
    res.render('./views/index.html')
});

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
// Global
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.post('/contact',(req,res) => {
	const name = req.body.name;
	const email = req.body.email;
	const subject = req.body.subject;

	const newContact = new Contact({name, email, subject});
	newContact.save().then(contacts => {
		res.send('Thank you <b>' + name + '</b> a representative will contact you shortly :)' + 
		'<br> <a href="../index.html">Return</a>'
		);	
	}).catch(err => console.log(err));
		
});

let messages = [];

io.on('connection', socket => {
    console.log(`New user: ${socket.id}`)

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);

        socket.broadcast.emit('receivedMessage', data);
    });
});

app.post('/addDestination',(req,res) => {
	const location = req.body.location;
	const img = req.body.img;
	const price = req.body.price;

	const newLocation = new Store({location, img, price});

	newLocation.save().then(store => {
		console.log('Store added.');	
	}).catch(err => console.log(err));
		
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.post('/retrieveContacts',(req, res, next) => {
	var resultArray=[];
	mongo.connect(db, (err, db) => {
        var tb = db.db("test");
		assert.equal(null, err);
		var cursor = tb.collection("contacts").find();
		cursor.forEach((doc, err) =>{
			assert.equal(null,err);
			resultArray.push(doc);
		},() =>{
            db.close();
            console.log(resultArray);
			res.send(JSON.stringify(resultArray));
		});
	});
});

app.post('/getOrders',(req, res, next) => {
	var resultArray=[];
	mongo.connect(db, (err, db) => {
        var tb = db.db("test");
		assert.equal(null, err);
		var cursor = tb.collection("purchases").find();
		cursor.forEach((doc, err) =>{
			assert.equal(null,err);
			resultArray.push(doc);
		},() =>{
            db.close();
            console.log(resultArray);
			res.send(JSON.stringify(resultArray));
		});
	});
});

app.post('/getAccounts',(req, res, next) => {
	var resultArray=[];
	mongo.connect(db, (err, db) => {
        var tb = db.db("test");
		assert.equal(null, err);
		var cursor = tb.collection("users").find();
		cursor.forEach((doc, err) =>{
			assert.equal(null,err);
			resultArray.push(doc);
		},() =>{
            db.close();
            console.log(resultArray);
			res.send(JSON.stringify(resultArray));
		});
	});
});

app.post('/deleteContact',(req,res) => {
	var id = req.body.id;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('contacts').deleteOne({"_id": objectId(id)}, (err, result)=>{
			assert.equal(null, err);
			db.close;
		})
	})
});

app.post('/addAdmin',(req,res) => {
	var addAdmin = {
		isAdmin : req.body.choice,
	};
	var id = req.body.idAdm;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('users').updateOne({"_id": objectId(id)}, {$set: addAdmin}, (err, result)=>{
			assert.equal(null, err);
			console.log('Admin added');
			db.close;
		})
	})		
});


app.post('/updateDestination',(req,res) => {
	var updatedStore = {
		location : req.body.location,
		img : req.body.img,
		price : req.body.price,
	};
	var id = req.body.id;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('stores').updateOne({"_id": objectId(id)}, {$set: updatedStore}, (err, result)=>{
			assert.equal(null, err);
			console.log('Item updated');
			db.close;
		})
	})		
});

app.post('/deleteDestination',(req,res) => {
	var id = req.body.id;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('stores').deleteOne({"_id": objectId(id)}, (err, result)=>{
			assert.equal(null, err);
			console.log('Item deleted');
			db.close;
		})
	})
});

app.post('/deleteOrder',(req,res) => {
	var id = req.body.id;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('purchases').deleteOne({"_id": objectId(id)}, (err, result)=>{
			assert.equal(null, err);
			console.log('Item deleted');
			db.close;
		})
	})
});

app.post('/deleteAccount',(req,res) => {
	var id = req.body.id;

	mongo.connect(db, (err, db) => {
		assert.equal(null, err);
		var tb = db.db("test") 
		tb.collection('users').deleteOne({"_id": objectId(id)}, (err, result)=>{
			assert.equal(null, err);
			console.log('Item deleted');
			db.close;
		})
	})
});

app.post('/:code', (req, res) =>{
    console.log(req.params.code + " , " + req.body.lname + ", " + req.body.fname);
     if (req.params.code == 1)
 	    nmongo.getData(req, res);
	else if (req.params.code == 2)
		nmongo.getMovies(req, res);
	
});