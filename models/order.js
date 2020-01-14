var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
});

module.exports = mongoose.model('Order', schema);