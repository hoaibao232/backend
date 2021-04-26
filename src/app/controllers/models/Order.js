const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const Order = new Schema({
    name: {type : String},
    address: {type: String},
    addresspm: {type: String, maxLength: 255},
    phone:{type: String, maxLength: 255},
    // productname:{type: String, maxLength: 255},
    // totalprice: {type: Number, default: 0},
    // quantity: {type: Number, default: 0},
    userID: {type: String, maxLength: 255},
    sellerID: {type: String, maxLength: 255},
    cartID: {type: String, maxLength: 255},
    productID: {type: String, maxLength: 255},
    status: {type: String, default: "Not approved"},
    payment: {type: Number, default: 0},
    sellerName: {type: String, maxLength: 255},
    // carts: [{cartIds : String}, {quantity : Number}, {total: Number}, {products: Array}],
    // cartIds: {type: Array},
    products: [{
      quantity: {type: Number, default: 0},
      tittle: {type: String, text: true, index: true},
      unit_cost: {type: Number, default: 0},
      total_cost: {type: Number, default: 0},    
      sellerId: {type: String}, 
      bookId: {type: String}, 
      cartId: {type: String}, 
      }]
  }, {timestamps: true,
  });

  Order.index({ "products.tittle": 'text' });
  // Order.ensureIndex({"comments.author" : 1})


//Custom query helper
Order.query.sortable = function (req) {
      if(req.query.hasOwnProperty('_sort')) {
        const isVaildtype = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
          [req.query.column] : isVaildtype ? req.query.type : 'desc',
        });
    }
    return this;

}


  //Add plugin
  mongoose.plugin(slug);
  Order.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });


  module.exports = mongoose.model('Order', Order);

