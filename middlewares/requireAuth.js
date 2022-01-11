const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res,next) => {
    //Used to Authorize the User ID
    const {authorization} = req.headers;

    if(!authorization){
        return res.status(401).send({error: 'Account is not logged in'});
    }

    const token = authorization.replace('Bearer ', '');
    jwt.verify(token, 'Thirdwayv', async (err,payload) => {
        //Used to verify the User JWT
        if(err){
            return res.status(401).send({error: 'Account is not logged in'});
        }
        const {userId} = payload;

        const user = await User.findById(userId);
        req.user = user;
        next();
    });
};