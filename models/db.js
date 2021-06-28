const mongoose = require('mongoose');
const db = process.env.MONGODB_URI;
console.log(db);
mongoose.connect(db,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err)=>{
    if(!err){
        console.log('MongoDB Connection Succeeded');
    }else{
        console.log('Error connecting to Database: ' + err)
    }
});

require('./productModel');
require('./userModel');