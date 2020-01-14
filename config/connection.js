let mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost:27017/databasename', { useMongoClient: true }); //mongodb://localhost:27017/crud
mongoose.connect('mongodb://dbuser:dbpassword1@ds141178.mlab.com:41178/heroku_xrd3kmbd', {useNewUrlParser: true });

module.exports = mongoose;