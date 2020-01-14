const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/');



express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`)) 

  router.get('/shopping-cart', function(req, res, next) {
    if(!req.session.cart){
      return res.render('shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice})
  });


