const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    //Used to set the different properties for each User
    email:{
        type: String,
        required:true,
        unique: true
    },
    password:{
        type: String,
        required:true
    }
});

userSchema.pre('save', function(next){
    //Used to encrypt the password using BCrypt

    const user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err){
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err,hash) =>{
            if(err){
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword) {
    //Used to check if the password is matched with the one in the DB

    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if(err){
                return reject(err);
            }
            if(!isMatch){
                return reject(false);
            }
            resolve(true);
        });
    });
};


mongoose.model('User',userSchema);