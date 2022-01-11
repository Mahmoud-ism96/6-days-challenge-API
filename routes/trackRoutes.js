const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');
const router = express.Router();

router.use(requireAuth);

router.get('/tracks', async (req,res) => {
    //Used to get all the Tracks associated to the User and sending it back to him
    const tracks = await Track.find({userId: req.user._id});
    res.send(tracks);
});

router.post('/tracks', async (req,res) => {
    //Used to create new Tracks
    const {name, locations} = req.body;
    if(!name || !locations) {
        return res.status(422).send({error: 'Please provide a Name and a Location'});
    }
    try{
        const track = new Track({name, locations, userId: req.user._id});
        await track.save();
        res.send(track);
    } catch (err){
        return res.status(422).send({error: 'Name or Location is invalid'});
    }
});

module.exports = router;