var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cart = require('../models/shopModel');
//var Product = mongoose.model('Product');
const Product = require('../models/productModel');
const stripeSecretKey = process.env.SECRET_KEY;
const stripePublicKey = process.env.PUBLISHABLE_KEY;
var stripe = require('stripe')(stripeSecretKey);

router.get('/order', (req,res)=>{
    Product.find(function(err, docs){
        var productsChunks = [];
        var chunkSize = 3;
        for(var i = 0; i <docs.length; i += chunkSize){
          productsChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/order', { title: 'Order Product', products: productsChunks });
      });   
});

router.get('/add-to-tray/:id', function(req, res){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
  
    Product.findById(productId, function(err, product){
        if (err){
            return res.redirect('/shop/order');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart)
        res.redirect('/shop/order')
    });
  });

  router.get('/reduce/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduceByOne(productId);
    req.session.cart = cart;
    res.redirect('/shop/foodtray');
});

router.get('/remove/:id', function(req, res, next) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(productId);
    req.session.cart = cart;
    res.redirect('/shop/foodtray');
});

router.get('/foodtray', function(req, res, next){
    if(!req.session.cart){
      return res.render('shop/foodtray', {products: null});
  
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/foodtray', {title: 'Food Tray', products: cart.generateArray(), 
    totalPrice: cart.totalPrice,
    key: stripePublicKey});
  });


  router.post('/payment', function(req, res){
    if(!req.session.cart){
      return res.render('shop/foodtray', {products: null});
  
    }
  
    stripe.customers.create({ 
        email: req.body.stripeEmail, 
        source: req.body.stripeToken, 
        name: 'Bernadette', 
        address: { 
            line1: 'Arlington', 
            postal_code: 'A0B C1D', 
            city: 'Winnipeg', 
            state: 'Manitoba', 
            country: 'Canada', 
        } 
    }) 
    .then((customer) => { 
        var cart = new Cart(req.session.cart); 
        return stripe.charges.create({ 
            amount: cart.totalPrice * 100,    
            description: 'DC Cafe Product', 
            currency: 'USD', 
            customer: customer.id 
        }); 
       
    }) 
    .then((charge) => { 
        req.session.cart = null;
        res.render('shop/success') // If no error occurs 
    }) 
    .catch((err) => { 
        res.send(err)    // If some error occurs
        console.log(err) ;
    }); 
});



module.exports = router;