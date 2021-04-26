const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const Schema = mongoose.Schema;

const Session = new Schema({
    idd: {type : String},
    userID: {type : String},
    cart: {type : Array,}
  });



  module.exports = mongoose.model('Session', Session);

