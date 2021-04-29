const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Admin = new Schema({
    username: {type : String},
     password: {type: String, required: true},
     phone: {type : String, default : ""},
     avatar: {type : String, default : ""},    
  }, {timestamps: true,
  });


  mongoose.plugin(slug);
  Admin.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });

  module.exports = mongoose.model('Admin', Admin);

