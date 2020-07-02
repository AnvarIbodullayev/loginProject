const express = require('express');
const router = express.Router();


// Music model
const Music = require('../model/Music');

// User model
const User = require('../model/User');

// eA = middleware function

const eA = (req,res,next) => {
		if (req.isAuthenticated()) {
				next();
		} else {
			req.flash('danger', 'Tizimga kiring');
			res.redirect('/login');
		}
}


// musiqa qo'shish
router.get('/add', eA, (req,res) => {

	res.render('music_add', {
		title: 'Musiqa qoshish'
	});

});

// Yuborish submit music add POST --
router.post('/add', eA, (req,res) => {

	req.checkBody('name', 'Ism bo\'sh bo\'lmasligi kerak').notEmpty();
	// req.checkBody('singer', 'Bastakor bo\'sh bo\'lmasligi kerak').notEmpty();
	req.checkBody('comment', 'Izoh bo\'sh bo\'lmasligi kerak').notEmpty();

	const errors = req.validationErrors();

	if (errors) {

		res.render('music_add', {
			title: 'Musiqa qo\'shish',
			errors: errors
		});

	} else {
		const music = new Music();

		music.name = req.body.name;
		music.singer = req.user._id;
		music.comment = req.body.comment;

		music.save((err) => {
			if (err) {
				console.log(err);
			} else {
				req.flash('success', 'Musiqa qo\'shildi');
				res.redirect('/');
			}
		});
	}
});

// bitta musiqani tanlash id orqali
router.get('/:id', eA, (req,res) => {
	Music.findById(req.params.id, (err, music) => {
		User.findById(music.singer, (err, user) => {
			res.render('music', {
				music: music,
				singer: user.name
			});
		})
	});
});

// bitta musiqani ozgartirish id orqali
router.get('/edit/:id', eA, (req,res) => {
	Music.findById(req.params.id, (err, music) => {

		if (music.singer != req.user._id) {
			req.flash('danger', 'Tizimga kirish kerak odamzod');
			res.redirect('/');
		}

		res.render('music_edit', {
			title: 'Musiqani o\'zgartirish',
			singer: user.name
		});

	});
});

// bitta musiqani ozgartirish id orqali POST --
router.post('/edit/:id', eA, (req,res) => {

	const music = {};

	music.name = req.body.name;
	music.singer = req.body.singer;
	music.comment = req.body.comment;

	const link = {_id:req.params.id}

	Music.updateOne(link, music, (err) => {
		if (err) {
			console.log(err);
		} else {
			req.flash('success', 'Musiqa o\'zgartirildi');
			res.redirect('/');
		}
	})

});

router.delete('/:id', eA, (req,res) => {

	if (!req.user._id) {
		res.status(500).send();
	}

	const link = {_id: req.params.id}

	Music.findById(req.params.id, (err,music) => {
		if (music.singer != res.user._id) {
			res.status(500).send();
		} else {
			
		}
	});

	Music.remove(link, (err) => {
		if (err) {
			console.log(err)
		}
		res.send('Success');
	})

});



module.exports = router;
