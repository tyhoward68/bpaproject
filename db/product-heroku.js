// var url = mongodb://<dbuser>:<dbpassword>@ds141178.mlab.com:41178/heroku_xrd3kmbd/";

var products = [
  new Products({
    imagePath: 'https://cdn2.bigcommerce.com/n-arxsrf/re90tm8/products/90/images/1661/Titanium-Ankle-Brace-Foot__96649.1488435009.1024.1024.jpg?c=2',
    title: 'Ankle Brace'
  })
]

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("Shopdb");
  var myobj = { name: "Company Inc", desc: "Highway 37" , price: "70", img: "http://imggoeshere"};
  dbo.collection("product").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); 