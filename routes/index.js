var express = require('express');
var router = express.Router();

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

router.get('/feedback', (req, res) => {
  res.render('feedback', { title: 'FeedBack'});
});


module.exports = router;
