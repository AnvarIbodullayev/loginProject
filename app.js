const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const passport = require('passport');
const mdb = require('./cf/db');

const app = express();

// mongoose connect
mongoose.connect( mdb.db, 
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true
	}
);
const db = mongoose.connection;

db.once('open', () => {
	console.log('mongodb ishladi');
})
db.on('error', (err) => {
	console.log('mongodb xato');
});

// model export
const Music = require('./model/Music');

// bodyParser chaqirish
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ------------------

// static fayllar
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// set public folder --
app.use(express.static(path.join(__dirname, 'public')));

// for navigation messages

// express messages --
app.use(flash ());
app.use( (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// express session --
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}))

// express validator --
app.use(expressValidator({
	errorForamatter: (param, msg, value) => {
		let namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root

		while(namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		}
	}
}));

// Passport cf
require('./cf/passport')(passport);
// Passport
app.use(passport.initialize());
app.use(passport.session());

// user init
app.get('*', (req,res,next) => {

	res.locals.user = req.user || null;
	next();

});

// ------------------

// Bosh sahifa
app.get('/', (req,res) => {

	Music.find({}, (err, musics) => {
		if (err){
			console.log(err);
		} else {
			res.render('index', {
				title: 'Bosh sahifa',
				musics: musics
			});
		}
	});

	

});

const musics = require('./routes/musics');
app.use('/music', musics);

const users = require('./routes/users');
app.use('/', users);


app.listen(3000, () => {
	console.log('3000 port ishladi');
}); 