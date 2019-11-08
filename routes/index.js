var express = require('express');
var router = express.Router();
var Product = require('../models/product')

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err,docs){
    res.render('pages/index', { title: 'Shopping Cart', products: products });
  });
});

/* GET home page. */
router.get('/shop', function(req, res, next) {
  res.render('shop/index', { title: 'Shopping Cart' });
});

module.exports = router;