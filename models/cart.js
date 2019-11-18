//
module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalItemQuantity = oldCart.totalItemQuantity || 0 ;
  this.totalItemPrice = oldCart.totalItemPrice || 0;
//pricing of items
  this.add = function(item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
        storedItem = this.items[id] = {item: item, qty: 0, price: 0};
    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty;
  
    this.totalItemQuantity++;
    this.totalItemPrice += storedItem.item.price;
  }
//List of items in cart
  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
        arr.push(this.items[id]);
    }
    return arr;
};
};

