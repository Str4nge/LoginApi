//Middleware for auth required to secure the REST endpoints
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const auth = async (req,res,next) =>{
    const token = req.header('Authorization').replace('Bearer ','');
    const data = jwt.verify(token,process.env.JWT_KEY);
    try{
        const user = await User.findOne({_id:data._id,'tokens.token':token});
        if(!user){
            console.log({error:'Unauthorized!'});
            throw new Error({error:"Unauthorized!"});
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch(err){
        console.log(err);
        res.status(401).send("Not authorized to access this resource.")
    }
}

module.exports = auth;