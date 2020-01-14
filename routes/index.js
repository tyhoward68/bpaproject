var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var flash = require('express-flash')

var Product = require('../models/product');
var User = require('../models/user');

//const req = require('request')
var csrfProtection = csrf();
router.use(csrfProtection);
router.use(express.json());


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'Shopping Cart' });
});

/* GET gear page. */
router.get('/shop/gear', function(req, res, next) {

if(!req.query.search){
  Product.find({ type: 'gear' }, function(err,docs){
    if(err){
      console.log(error)
    }
    var productChunks = [];
    var chunkSize = 3;
    for (var i = 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    console.log("docs:" + docs);
    res.render('shop/gear', { title: 'Shopping Cart', products: productChunks });
  });
}
else{
  Product.find({type:'gear',title: {$regex: req.query.search, $options: 'i'}}, function(err,docs){
    if (err){
      console.log(err);
    }
    var productChunks = [];
    var chunkSize =3;
    for(var i= 0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    console.log("docs:" + docs);
    res.render('shop/gear', {title: 'Shopping Cart', products: productChunks});
  });
}

});

/* GET clothes page. */
router.get('/shop/clothes', function(req, res, next) {

  if(!req.query.search){
    Product.find({ type: 'clothes' }, function(err,docs){
      if(err){
        console.log(error)
      }
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/clothes', { title: 'Shopping Cart', products: productChunks });
    });
  }
  else{
    Product.find({type:'clothes',title: {$regex: req.query.search, $options: 'i'}}, function(err,docs){
      if (err){
        console.log(err);
      }
      var productChunks = [];
      var chunkSize =3;
      for(var i= 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/clothes', {title: 'Shopping Cart', products: productChunks});
    });
  }
  
  });
  

/* GET shoes page. */
router.get('/shop/shoes', function(req, res, next) {

  if(!req.query.search){
    Product.find({ type: 'shoes' }, function(err,docs){
      if(err){
        console.log(error)
      }
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/shoes', { title: 'Shopping Cart', products: productChunks });
    });
  }
  else{
    Product.find({type:'shoes',title: {$regex: req.query.search, $options: 'i'}}, function(err,docs){
      if (err){
        console.log(err);
      }
      var productChunks = [];
      var chunkSize =3;
      for(var i= 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/shoes', {title: 'Shopping Cart', products: productChunks});
    });
  }
  
  });
/* GET jerseys page. */
router.get('/shop/jerseys', function(req, res, next) {

  if(!req.query.search){
    Product.find({ type: 'jerseys' }, function(err,docs){
      if(err){
        console.log(error)
      }
      var productChunks = [];
      var chunkSize = 3;
      for (var i = 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/jerseys', { title: 'Shopping Cart', products: productChunks });
    });
  }
  else{
    Product.find({type:'jerseys',title: {$regex: req.query.search, $options: 'i'}}, function(err,docs){
      if (err){
        console.log(err);
      }
      var productChunks = [];
      var chunkSize =3;
      for(var i= 0; i < docs.length; i += chunkSize){
        productChunks.push(docs.slice(i, i + chunkSize));
      }
      console.log("docs:" + docs);
      res.render('shop/jerseys', {title: 'Shopping Cart', products: productChunks});
    });
  }
  
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
      //res.redirect('/');
      res.redirect('back');

  })
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});






router.get('/shopping-cart', function (req, res, next) {
  if(!req.session.cart) {
      return res.render('shop/shopping-cart', {products: null});
  }
  var cart = new Cart(req.session.cart);
  return res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, qty: cart.totalQty});
});


module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
};

