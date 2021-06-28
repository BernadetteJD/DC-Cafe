const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }, 
    description:{
        type: String
    }, 
    image:{
        type: String,
        required: true
    }
});

//mongoose.model('Product', productSchema);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;