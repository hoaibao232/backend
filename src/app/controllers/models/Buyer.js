const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Buyer = new Schema({
    username: {type : String, required: true},
    // idd: {type : String,  default:""},
     password: {type: String, required: true},
     phone: {type : String,  default:""},
     avatar: {type : String, default:""},
     address: {type : String, default:""},
     buyername : {type : String, default:""}
  }, {timestamps: true,
  });

  Buyer.query.sortable = function (req) {
    if(req.query.hasOwnProperty('_sort')) {
      const isVaildtype = ['asc', 'desc'].includes(req.query.type);
      return this.sort({
        [req.query.column] : isVaildtype ? req.query.type : 'desc',
      });
  }
  return this;

  }

  mongoose.plugin(slug);
  Buyer.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });

  module.exports = mongoose.model('Buyer', Buyer);

