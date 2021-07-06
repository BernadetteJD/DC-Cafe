const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const multer = require('multer');
const { ensureAuthenticated } = require('../config/auth');
const { authRole } = require('../config/adminAuth')

// 06-15-21 Defining multer storage
const storage = multer.diskStorage({
    destination:function(req, file, callback){
        callback(null, './public/uploads/images')
    },
    filename:function(req,file,callback){
        callback(null, Date.now() + file.originalname)
    }
});

var upload = multer({storage: storage});

router.get('/', ensureAuthenticated, authRole("Admin"), (req, res) =>{
    res.render('admin/insert',{title: 'Add Product'});
});

router.post('/', upload.single('image'), ensureAuthenticated, authRole("Admin"), (req, res)=>{
    insertProduct(req,res);
});

router.post('/update', ensureAuthenticated, authRole("Admin"),(req, res)=>{
    updateProduct(req,res);
});

function insertProduct(req,res){
    var product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.file.filename;
    product.save((err, doc) =>{
        if(!err){
            res.redirect('admin/list');
        }else{
            console.log('Error during product insertion: ' + err)
        }
    });
}

function updateProduct (req,res) {
    Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if(!err){
            res.redirect('/admin/list');
        }else{
            console.log('Error during updating product: ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, authRole("Admin"), (req, res) =>{
    Product.find(function(err, docs){
        var productsChunks = [];
        var chunkSize = 3;
        for(var i = 0; i <docs.length; i += chunkSize){
          productsChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('admin/list', { title: 'Product List', products: productsChunks });
      }); 
});

router.get('/update/:id', ensureAuthenticated, authRole("Admin"), (req, res) => {
    Product.findById(req.params.id, (err, doc) =>{
        if(!err){
            res.render('admin/update',{title: 'Update Product', product:doc});
        }
    });   
});

router.get('/delete/:id', ensureAuthenticated, authRole("Admin"), (req, res) => {
    Product.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/list');
        }
        else { console.log('Error in deleting product :' + err); }
    });
});

module.exports = router;