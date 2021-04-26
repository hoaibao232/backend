const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
mongoose.set('useCreateIndex', true);

const Schema = mongoose.Schema;

const Book = new Schema({
    name: {type : String, text: true, index: true},
   description: {type: String, required: true},
    image: {type: String},
    videoID:{type: String, maxLength: 255},
    sellerID:{type: String, maxLength: 255},
    shopname : {type: String, maxLength: 255},
    price: {type: Number, default: 0},
    quantities : {type: Number, default: 0},
    slug: { type: String, slug: 'name', unique: true },
    sold: {type : Number, default : 0},
  }, {timestamps: true,
  });

  Book.index({ name: 'text' });

//Custom query helper
  Book.query.sortable = function (req) {
      if(req.query.hasOwnProperty('_sort')) {
        const isVaildtype = ['asc', 'desc'].includes(req.query.type);
        return this.sort({
          [req.query.column] : isVaildtype ? req.query.type : 'desc',
        });
    }
    return this;

    }


  mongoose.plugin(slug);
  Book.plugin(mongooseDelete,{ 
    deletedAt: true,  
    overrideMethods: 'all' });


  module.exports = mongoose.model('Book', Book);

