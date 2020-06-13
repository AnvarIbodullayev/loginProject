const express = require('express');
const router = express.Router();


// User
const Music = require('../model/Music');


// musiqa qo'shish
router.get('/add', (req,res) => {

	res.render('music_add', {
		title: 'Musiqa qoshish'
	});

});

// Yuborish submit music add POST --
router.post('/add', (req,res) => {

	req.checkBody('name', 'Ism bo\'sh bo\'lmasligi kerak').notEmpty();
	req.checkBody('singer', 'Bastakor bo\'sh bo\'lmasligi kerak').notEmpty();
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
		music.singer = req.body.singer;
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
router.get('/:id', (req,res) => {
	Music.findById(req.params.id, (err, music) => {
		res.render('music', {
			music:music
		});
	});
});

// bitta musiqani ozgartirish id orqali
router.get('/edit/:id', (req,res) => {
	Music.findById(req.params.id, (err, music) => {
		res.render('music_edit', {
			title: 'Musiqani o\'zgartish',
			music:music
		});
	});
});

// bitta musiqani ozgartirish id orqali POST --
router.post('/edit/:id', (req,res) => {

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

router.delete('/:id', (req,res) => {

	const link = {_id:req.params.id}

	Music.remove(link, (err) => {
		if (err) {
			console.log(err)
		}
		res.send('Success');
	})

});



module.exports = router;