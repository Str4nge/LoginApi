//Model for the user here...
const mongoose = require('mongoose');               //For handling mongo data models    
const validator = require('validator');             //For validating data before saving     
const jwt = require('jsonwebtoken');                //For authentication and tokens 
const bcrypt = require('bcryptjs');                 //FOre security and encryption

//Defining the schema of database
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                console.log("err in validate segment")             //check if the email is valid or not
                throw new Error({ error: 'Invalid email id' });
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

//Do this before saving the data...
userSchema.pre('save', async function (next) {                  /*Donot use arrow func where 'this' is to be used as arrow func changes scope of 'this' pointer*/
    //Hash the password before saving
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

//Generate an auth token for user
userSchema.methods.generateAuthToken = async function () {                  //#1
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    user.save();
    return token;
}

//Search a user from email and password
userSchema.statics.findByCredentials = async (email, password) => {         //#2
    const user = await User.findOne({ email });
    if (!user) {
        console.log({ error: "Invalid Login credentials user not found" });
        throw new Error("Invalid Login credentials user not found");
    }
    //compare the hashed password and the password entered
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        console.log({ error: "Invalid Login credentials" });
        throw new Error("Invalid Login credentials");
    }
    return user;
}

//#1 We use methods when we want to query individual documents
//#2 We use statics to create static methods when we want to query the whole model

//Create a model using the userSchema and export it
const User = mongoose.model('User', userSchema);
module.exports = User;