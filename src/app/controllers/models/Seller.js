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
  }, {timestamps: true,
  });

  mongoose.plugin(slug);
  Seller.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });

  module.exports = mongoose.model('Seller', Seller);

