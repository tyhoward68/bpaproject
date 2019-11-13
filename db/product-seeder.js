
var MongoClient = require('mongodb').MongoClient;
var Product = require('../models/product');

var mongoose = require('mongoose');

mongoose.connect('mongodb://dbuser:dbpassword1@ds141178.mlab.com:41178/heroku_xrd3kmbd')

var products =  [ 
    new Product({
    imagePath:  'asdasd',
    title: 'asdasd',
    description:'asdas',
    price:'asdas',
})


];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function(err, result){
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}


