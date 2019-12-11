let express = require('express');
let router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

let mongoose = require('../config/connection');
let product = require('./../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(express.json());


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
