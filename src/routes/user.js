//API routes for user model here...
const express = require('express');
const User = require('../models/userModel');
const auth = require('../middleware/auth')
const router = express.Router();

//Route for Register new user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
        console.log(`New user registered : ${user.name}`);
    }
    catch (err) {
        res.status(400).send(err.toString());
    }
});

//Route for Log a user in
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if (!user) {
            return res.status(401).send({ error: "Login failed! Check Login credentials." });
        }
        const token = await user.generateAuthToken();
        res.status(200).send({ user, token });
        console.log(`${user.name} logged in`);
    }
    catch (err) {
        res.status(400).send(err.toString());
    }
});

//Route to see logged in user profile
router.get('/profile',auth,async (req,res)=>{
    res.send(req.user.toString());
});


module.exports = router;