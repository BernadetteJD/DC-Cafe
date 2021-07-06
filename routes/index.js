var express = require('express');
var router = express.Router();
const { ensureAuthenticated } = require('../config/auth');


/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'DC Cafe'});
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us'});
});

router.get('/menu', (req, res) => {
  res.render('menu', { title: 'Menu'});
});



router.get('/profile', ensureAuthenticated, (req, res) =>{
  res.render('user/profile', {name: req.user.name , role: req.user.role});
});




module.exports = router;
