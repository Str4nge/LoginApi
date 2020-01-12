//The express script for serving API requests

const express = require('express');                    //load express to file
const userRouter = require('./routes/user');           //import routers
require('./db/db');                                     // Database connection

const app = express();
const port = process.env.PORT || 4500;                  //set the port number of the PORT environment variable

app.use((req,res,next)=>{
    console.log(`${req.method} request made : ${req.url}`);
    next();
});
app.use(express.json());                                //Middleware to parse requests in JSON format
app.use(userRouter);                                    //Middleware to use the user routes


//Express server setup
app.listen(port, () => {
    console.log(`Server started and listening to ${port}`)
});
