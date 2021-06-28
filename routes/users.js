var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
//const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/userModel');

/* GET users listing. */
router.get('/login', (req, res) =>{
  res.render('user/login',{title: 'LogIn'});
});

router.get('/signup', (req, res) =>{
  res.render('user/signup',{title: 'Sign Up'});
});

//Sign up handle

router.post('/signup',(req,res)=>{
  const { name, email, password, password2} = req.body;
  let errors =[];

  // Check required fields

  if (!name || !email || !password || !password2){
    errors.push({msg: 'Please fill all fields'});
  }

  // Check passwords match
  if(password !== password2){
    errors.push({ msg: 'Password do not match'});
  }

  // Check password length
  if(password.length < 6){
    errors.push({ msg: 'Password should be at least 6 characters'})
  }

  if(errors.length > 0){
    res.render('user/signup', {
      errors,
      name,
      email,
      password,
      password2
    })
  }else{
    // Validation Passed
    User.findOne({email:email})
    .then(user =>{
      if(user){
        //User exist
        errors.push({ msg: 'Email is already registered'});
        res.render('user/signup', {
          errors,
          name,
          email,
          password,
          password2
        });
      }else{
        const newUser = new User({
          name,
          email,
          password
        });

        //Hash Password
        bcrypt.genSalt(10, (err, salt) => 
          bcrypt.hash(newUser.password, salt, (err,hash) =>{
            if(err) throw err;
              //Set password to hashed
            newUser.password = hash;
            // Save user
            newUser.save()
              .then(user =>{
                req.flash('success_msg', 'You are now registered')
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
        }))
      }
    })
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/users/profile',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// router.post('/login',
//   passport.authenticate('local'),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.redirect('/users/' + req.user.username);
//   });

router.get('/profile', ensureAuthenticated, (req, res) =>{
  res.render('user/profile', {name: req.user.name , role: req.user.role});
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
