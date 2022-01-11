const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');
const router = express.Router();

router.post('/signup', async (req,res) => {
    //Used to send the Signup request
    const {email,password} = req.body;

    try{
        //Used to create new user and saving the data
        const user = new User({email,password}); 
        await user.save();
        
        //Used to encode the User ID and send it back
        const token = jwt.sign({userId: user._id}, 'Thirdwayv');
        res.send({token});
    } catch (err) {
        //Sending error message if Email is already saved in the DB
        return res.status(422).send({error: 'Email is already registered'});
    }
});

router.post('/signin', async (req, res) =>{
    //Used when user try to SignIn
    const {email,password} = req.body;
    if(!email || !password){
        //Sending error if email or password is not provided
        return res.status(422).send({error: 'Please provide an Email and a Password'});
    }
    const user = await User.findOne({email});
    if(!user){
        //Sending error if email is not registered
        return res.status(422).send({error: 'Email is not registered'});
    }
    //Try and Catch to verify the Email and the Password
    try{
        await user.comparePassword(password);
        const token = jwt.sign({userId: user._id}, 'Thirdwayv');
        res.send({token});
    } catch (err) {
        return res.status(422).send({error: 'Invalid Email or Password'});
    }
});

module.exports = router;