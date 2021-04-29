const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Seller = new Schema({
    username: {type : String},
     password: {type: String, required: true},
     phone: {type : String, default : ""},
     avatar: {type : String, default : ""},
     address: {type : String, default : ""},
     shopname: {type: String, default : ""},
     productsCount : {type : Number, default : 0}
  }, {timestamps: true,
  });

  Seller.query.sortable = function (req) {
    if(req.query.hasOwnProperty('_sort')) {
      const isVaildtype = ['asc', 'desc'].includes(req.query.type);
      return this.sort({
        [req.query.column] : isVaildtype ? req.query.type : 'desc',
      });
  }
  return this;

  }

  mongoose.plugin(slug);
  Seller.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });

  module.exports = mongoose.model('Seller', Seller);