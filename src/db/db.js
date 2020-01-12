//Database connections for the api here...
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
    useCreateIndex : true,
    useUnifiedTopology:true
});