var express = require('express');
var router = express.Router();
var Product = require('../models/product');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
    Product.find(function(err,docs){
      if (err){
        console.log(err);
      }
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('pages/index', { title: 'Shopping Cart', products: productChunks });
  });
});

/* GET home page. */
router.get('/shop', function(req, res, next) {
  res.render('shop/index', { title: 'Shopping Cart' });
});

/* GET gear page. */
router.get('/shop/gear', function(req, res, next) {
  res.render('shop/gear', { title: 'Shopping Cart' });
});

/* GET clothes page. */
router.get('/shop/clothes', function(req, res, next) {
  res.render('shop/clothes', { title: 'Shopping Cart' });
});

/* GET shoes page. */
router.get('/shop/shoes', function(req, res, next) {
  res.render('shop/shoes', { title: 'Shopping Cart' });
});

/* GET jerseys page. */
router.get('/shop/jerseys', function(req, res, next) {
  res.render('shop/jerseys', { title: 'Shopping Cart' });
});



/* GET home page. */
router.get('/bill', function(req, res, next) {
  res.render('shop/index', { title: 'Shopping Cart' });
});

/*
router.get('/add-to-cart', function(req, res, next){
  var productId = req.params.id;
  res.render('shop/index');
});
*/

//include cart model
var Cart = require('../models/cart');


router.get('/add-to-cart/:id', function (req, res) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, function (err, product) {
      if(err) {
          return res.redirect('/');
      }

      cart.add(product, product.id);
      req.session.cart = cart;
      console.log(req.session.cart);
      res.redirect('/');

  })
});

router.get('/shopping-cart', function (req, res, next) {
  if(!req.session.cart) {
      return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  return res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalItemPrice});
});


router.get('/checkout', function(req, res, next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalItemPrice});
});


router.get('/user/signup', function(req, res, next){
  res.render('user/signup', {csrfToken: req.csrfToken()});
});

router.post('user/signup', function(req,res,next){
  res.redirect('/');
})


module.exports = router;