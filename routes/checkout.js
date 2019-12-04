var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require ('../models/cart');

router.use(express.json());

router.get('/', isLoggedIn, function (req, res, next) {
  if(!req.session.cart) {
      return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  return res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});


router.post('/', isLoggedIn, function(req, res, next) {
  if(!req.session.cart) {
      return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);
  console.log(req.body.name);
  //req.checkBody('name', 'Invalid Name').isLength({ min: 5 })
  var errors = req.validationErrors();
  if (errors) {
      var messages = [];
      errors.forEach(function (error) {
          messages.push(error.msg);
        });
        //return done(null, false, req.flash('error', messages));
        console.log(errors);
        return res.render('shop/checkout', {total: cart.totalPrice, messages: errors, hasErrors: messages.length > 0});

   };


      var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          name: req.body.name,
      });
      order.save(function(err, result) {
          req.flash('success', 'Thank you for your purchase(s)!');
          req.session.cart = null;
          res.redirect('/');
          console.log("order saved");
        });
});



module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}