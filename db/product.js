var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://dbuser:dbpassword1@ds141178.mlab.com:41178/heroku_xrd3kmbd";
var Product = require('../models/product');

var products = [
  new Product({
    imagePath: 'https://cdn2.bigcommerce.com/n-arxsrf/re90tm8/products/90/images/1661/Titanium-Ankle-Brace-Foot__96649.1488435009.1024.1024.jpg?c=2',
    title: 'Ankle Brace',
    description:'Black',
    price:'15',
  }),
  new Product({
    imagePath: 'https://scheels.scene7.com/is/image/Scheels/88779106650?wid=600&hei=600&qlt=75',
    title: 'NBA Shooting Sleeve',
    description:'Black',
    price:'20',
  }),
  new Product({
    imagePath: 'https://image.sportsmansguide.com/adimgs/l/6/672564m2_ts.jpg',
    title: 'Thick Hunting Jacket',
    description:'Camo',
    price:'69',
  }),
  new Product({
    imagePath:'https://mail.google.com/mail/u/0?ui=2&ik=26e9f7e5bb&attid=0.1.1&permmsgid=msg-f:1650108646069748605&th=16e65d1229c9c37d&view=fimg&sz=s0-l75-ft&attbid=ANGjdJ-aoZMM3dsp3FoNKQeCQgd2p1-_yvoC_PwC3v1DrtoddUhkVs6Wk1GyDATX6Vu2XkDdzjNo-5FlJBzzyZ1gDqC11bj-N6xx9mSQrrVp8zoFkS0XOK7S6akaAPs&disp=emb',
    title: 'Ivysaur',
    description:'Grass',
    price:'1000000000',
  })
  
];



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("heroku_xrd3kmbd");
  
  var myobj = { 
    imagePath: 'https://cdn2.bigcommerce.com/n-arxsrf/re90tm8/products/90/images/1661/Titanium-Ankle-Brace-Foot__96649.1488435009.1024.1024.jpg?c=2',
    title: 'Ankle Brace',
    description:'asdas',
    price:'asdas'
};
/* 
 // var myobj =Product;
  dbo.collection("product").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); 
**/

 // var myobj =Product;
 dbo.collection("products").insertMany(products, function(err, res) {
  if (err) throw err;
  console.log("1 document inserted");
  db.close();
});
}); 