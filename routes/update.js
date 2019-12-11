let express = require('express');
let router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

let mongoose = require('../config/connection');
let product = require('../models/product');

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', (req, res, next) => {
  product.find((err, products) => {
    if (err) throw err;
    res.render('update/update_index', { csrfToken: req.csrfToken(), products: products });
  });
});

router.get('/New', (req, res, next) => {
  res.render('update/productForm', {});
});

router.get('/Modify/:id', (req, res, next) => {
  let idproduct = req.params.id;  
  product.findOne({_id: idproduct }, (err, product) => {
    if (err) throw err;
    res.render('update/productForm', { product: product });
  });
});

router.get('/update/Delete/:id', (req, res, next) => {
  let idproduct = req.params.id;

  
  product.remove({_id: idproduct }, (err) => {
    if (err) throw err;
    res.redirect('/');
  });


});

router.post('/update/operar', (req, res, next) => {
  console.log(req.body);  

  if (req.body._id === "") {
    let prod = new product({
      imagePath: req.body.imagePath,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price
    });
    
    prod.save();
  } else {    
    //console.log(req.body._id);
    product.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true }, (err, model) => {
      if (err) throw err;
    });
  }
  res.redirect('/');
});

module.exports = router;
