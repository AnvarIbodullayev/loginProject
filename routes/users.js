const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const flash = require("connect-flash");
const router = express.Router();


// User
const User = require('../model/User');

// Register page (Royhatdan otish)
router.get('/register', (req,res) => {

	res.render('register');

});

router.post('/register', (req,res) => {

	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.checkBody('name', 'Ism Kiritilishi kerak').notEmpty();
	req.checkBody('email', 'Email Kiritilishi kerak').notEmpty();
	req.checkBody('email', 'Email Bo\'lishi kerak').isEmail();
	req.checkBody('username', 'Foydalanuchhu Ismi Kiritilishi kerak').notEmpty();
	req.checkBody('password', 'Parol Kiritilishi kerak').notEmpty();
	req.checkBody('password2', 'Parol To\'gri kelmadi').equals(req.body.password);

	const errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	} else {
		const newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		// password ni hashlash
		bcrypt.genSalt(10, (err,pass) => {
			bcrypt.hash(newUser.password, pass, (err,hash) => {
				
				if (err) {
					console.log(err);
				} else {
					newUser.password = hash;
				}

				newUser.save((err) => {
					if (err) {
						console.log(err);
					} else {
						req.flash('success', 'Muvaffaiyatli ro\'yhatdan o\'tdingiz');
						res.redirect('login');
					}
				})

			});
		});
	}
});

// Login Sahifasi
router.get('/login', (req,res) => {

	res.render('login', {
		title: 'Tizimga Kirish'
	});

});

// Login Sahifasi
router.post('/login', (req,res,next) => {

	passport.authenticate('local', {
		successRedirect: '/',
		ailureRedirect: '/login',
		failureFlash: true
	})(req,res,next);
});

// Logout
router.get('/logout', (req,res) => {

	req.logout();
	req.flash('success', 'Muvaffaiyatli Tizimdan chiqdingiz');
	res.redirect('/')

});

module.exports = router;