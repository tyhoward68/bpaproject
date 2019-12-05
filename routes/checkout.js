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


router.post('/', isLoggedIn, function(req, res, next) {
  if(!req.session.cart) {
      return res.redirect('/shopping-cart');
  }

  var cart = new Cart(req.session.cart);
  req.checkBody('name', 'Invalid Name').isLength({ min: 5 })
  req.checkBody('address', 'Invalid Address, Please inpuput your full address').isLength({ min: 20 })
  req.checkBody('card-number', 'Invalid Card. Must be 16 digits long').isNumeric({ min: 16 })
  req.checkBody('card-expiry-month', 'Invalid Month. If less then 10, place 0 before the number').isNumeric({ max: 12, min: 1 })
  req.checkBody('card-expiry-Year', 'Invalid Year. Input whole year. Ex: 2040, 2031, 2020.').isNumeric({ max: 2025, min: 2019})
  req.checkBody('card-cvc', 'Invalid CVC. Three digits on the back of your card.').isNumeric({ max: 3, min: 3 })
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
          name: req.body.name,
      });

      order.save(function(err, result) {
        //console.log(err)
          req.flash('success', 'Thank you for your purchase(s)!');
          req.session.cart = null;
          res.redirect('/');
          //console.log("order saved");
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