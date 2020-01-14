var express = require('express');
var router = express.Router();
var flash = require('express-flash');
var Product = require('../models/product');
var Order = require('../models/order');
var Cart = require ('../models/cart');

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

router.get('/', isLoggedIn, function (req, res, next) {
  if(!req.session.cart) {
      return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  return res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/clear-cart', function(req, res, next) {
  req.session.cart = null;
  res.redirect('back');
});



router.post('/', isLoggedIn, function(req, res, next) {
  if(!req.session.cart) {
      return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);
  req.checkBody('firstName', 'Invalid Name. Must be atleast 2 characters long ').isLength({ min: 2 })
  req.checkBody('firstName', 'Invalid Name. must be alphabetical.').isAlpha()
  req.checkBody('lastName', 'Invalid Last Name. Must be alphabetical').isAlpha()
  req.checkBody('lastName', 'Invalid Last Name. Must be 2 characters long').isLength({ min:2 })
  req.checkBody('address', 'Invalid Address, Please input your full address').isLength({ min: 10 })
  req.checkBody('card-number', 'Invalid Card. Must 16 digits long').isLength({ min: 15 })
  req.checkBody('card-number', 'Invalid Card. Must be numeric ').isNumeric()
  req.checkBody('card-expiry-month', 'Invalid Month. Number must be between 1 and 12.').isNumeric({  min: 1, max: 12 })
  req.checkBody('card-expiry-Year', 'Invalid Year. Input whole year. Ex: 2040, 2031, 2020.').isNumeric({min: 2020, max: 2025})
  req.checkBody('card-cvc', 'Invalid CVC. Must be Numeric.').isNumeric({min: 100, max: 999})
  req.checkBody('card-cvc', 'Invalid CVC. Must be 3 digits long.').isLength({ max: 3})
  var errors = req.validationErrors();
  if (errors) {
      var messages = [];
      errors.forEach(function (error) {
          messages.push(error.msg);
        });
        //return done(null, false, req.flash('error', messages));
        //console.log(errors);
        return res.render('shop/checkout', {total: cart.totalPrice, messages: errors, hasErrors: messages.length > 0});

   }
   else {

   console.log(req.body)
   
      var order = new Order({
          user: req.user,
          cart: cart,
          address: req.body.address,
          firstname: req.body.firstName,
          lastname: req.body.lastName
      });

      order.save(function(err, result) {
        //console.log(err)
          req.flash('success', 'Thank you for your purchase(s)!');
          req.session.cart = null;
          req.session.isAdminRole = null;
          req.logout();
          res.redirect('user/profile');
          console.log("order saved");
        });
      }

});



module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}