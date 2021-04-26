const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Cart = new Schema({
  productID: {type: String},
  productname: {type: String},
  productslug: {type: String},
  productimage: {type: String},
  price: {type: Number, default: 0},
  totalprice: {type: Number, default: 0},
  quantity: {type: Number, default: 0},
  userID: {type: String},
  sellerID: {type: String},
  sellerName: {type: String},
  //shopname: {type: String},
  //products: [{quantity : Number, tittle: String, unit_cost: Number}]
  });

  mongoose.plugin(slug);
  Cart.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });


  module.exports = mongoose.model('Cart', Cart);

