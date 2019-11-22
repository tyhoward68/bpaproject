var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var flash = require('express-flash')

var Product = require('../models/product');


var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/shop', function(req, res, next) {
    Product.find(/**{type:'gear'},**/ function(err,docs){
      if (err){
        console.log(err);
      }
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/gear', { title: 'Shopping Cart', products: productChunks });
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Shopping Cart' });
});

/* GET gear page. */
router.get('/shop/gear', function(req, res, next) {
  Product.find({type:'gear'}, function(err,docs){
    if (err){
      console.log(err);
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    console.log("docs:" + docs);
    res.render('shop/gear', { title: 'Shopping Cart', products: productChunks });
  });
});

/* GET clothes page. */
router.get('/shop/clothes', function(req, res, next) {
  Product.find(/**{type:'gear'},**/ function(err,docs){
    if (err){
      console.log(err);
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    console.log("docs:" + docs);
    res.render('shop/clothes', { title: 'Shopping Cart', products: productChunks });
  });
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

//const { check, validationResult } = require('express-validator');

router.get('/checkout1', function(req, res, next){
  var messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/user/signup', function(req, res, next){
  var messages = req.flash('error');
  console.log(messages);
  console.log(messages.length);
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});
/**
router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));
*/

router.post('/user/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if(req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
  } else {
      res.redirect('/user/profile');
  }
});

router.get('/user/profile', function(req, res, next){
  res.render('user/profile');
});


router.get('/user/signin', function(req, res, next){
  var messages = req.flash('error');
  console.log(messages);
  console.log(messages.length);
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/user/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), function (req, res, next) {
  if(req.session.oldUrl) {
      var oldUrl = req.session.oldUrl;
      req.session.oldUrl = null;
      res.redirect(oldUrl);
  } else {
      res.redirect('/user/profile');
  }
});




router.get('/user/signuptest', function(req, res, next){
  console.log("get");
  var errors = req.flash('errors'); //display error on page
  res.render('user/signuptest', {csrfToken: req.csrfToken(), errors: errors, hasErrors: messages.length > 0});
});


const { check, validationResult } = require('express-validator');
router.use(express.json());
router.post('/user/signuptest', [
  // username must be an email
  check('email').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 }).withMessage('must be at least 5 chars long')
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    //return res.status(422).json({ errors: errors.array() });
    res.render('user/signuptest', {csrfToken: req.csrfToken(), errors: errors.array(), hasErrors: errors.length > 0});
  }

  //Move on to next page everthing is good.
});




module.exports = router;