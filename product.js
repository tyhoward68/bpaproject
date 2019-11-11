var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://dbuser:dbpassword1@ds141178.mlab.com:41178/heroku_xrd3kmbd";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("heroku_xrd3kmbd");
  var myobj = { name: "Company Inc", desc: "Highway 37" , price: "70", img: "http://imggoeshere"};
  dbo.collection("product").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
}); 