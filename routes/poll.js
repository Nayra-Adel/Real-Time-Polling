const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');
const Vote = require('../models/Vote');

const Pusher  = require('pusher');
var pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: 'eu',
  encrypted: true
});

router.get('/', (req, res) => {
	Vote.find()
		.then(votes => res.json({
			success: true,
			votes: votes
		}));
});

router.post('/', (req, res) => {
	const newVote = {
	  laptop: req.body.laptop,
	  points: 1
	}

	new Vote(newVote).save().then(vote => {
		pusher.trigger('laptop-poll', 'laptop-vote', {
		  points: parseInt(vote.points),
		  laptop: vote.laptop
		});
	return res.json({
		success: true,
		message: 'Thank You for voting'
	});
	});
});

module.exports = router;