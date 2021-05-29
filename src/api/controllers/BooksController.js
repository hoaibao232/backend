const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const  { mongooseToObject } = require('../../util/mongoose');
const { setCookie } = require('../../middlewares/cookie.middleware');

const fs = require('fs')
/* var result1 = [] */
var result1 = []
var result2 = []
var path = require('path');

function readFromFile(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(data.toJSON());
            }
        });
    });
}


class BooksController {    
    //[GET] /course/:slug
    show(req,res, next)
    {
        Book.findOne({slug : req.params.slug})
            .then(book => {
                // res.render('books/show1' , { 
                //     book: mongooseToObject(book),
                //     errors: req.session.errors,
                // })
                res.json(book)
                // req.session.errors = null;
            })
            .catch(next);
    }

    create(req,res,next)
    {
        res.render('books/create1');
    }

    //POST
    store(req,res,next)
    {

        var cookie3 = setCookie(req)
        console.log(req.body)
        
          Seller.findOne({_id: cookie3})
            .then(seller => {
                var imagestr = "\\" + req.file.path.split('\\').slice(1).join('\\');
                req.body.image = imagestr.replace(/\\/g,'/'),
                req.body.sellerID = cookie3;
                req.body.shopname = seller.shopname;
                const book = new Book(req.body);
                console.log(book)
                book.save()
                    .then(() => {
                    
                        Seller.updateOne({_id: cookie3 }, { $inc: {productsCount : 1} }, function(err, doc) {
                            if (err) return console.error(err);
                            else{
                                res.json({message : 'Add product successfully'}) 
                            }
                          });
                        
                     
                    }
                    )
                    .catch(error => {console.log(error)});
            }) 
        
           
    }

    //GET /courses/:id/edit
    edit(req,res,next)
    {
        Book.findById(req.params.id)
            .then(book => res.render('books/edit1', {
                book: mongooseToObject(book)
            }))
            .catch(next);
    }

   
    //PUT /course/:id
    update(req,res,next)
    {
        console.log(req.body)
        Book.find({_id: req.params.id}, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Book not found'
                })
             }
        
            if (result) {
                if(!req.file)
                {
                    Book.findOne({_id: req.params.id})
                        .then(book => {
                            req.body.image = book.image;
                            Book.updateOne({_id: req.params.id }, req.body)
                                .then(() => res.json({message : 'Update book info successfully'}))
                                .catch(next);
                        })
                }
                else{
                    req.body.image = "\\" + req.file.path.split('\\').slice(1).join('\\');
                    Book.updateOne({_id: req.params.id }, req.body)
                        .then(() => res.json({message : 'Update book info successfully'}))
                        .catch(next);
                }
            } 
            else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Book not found'
                    })
            }
        })
       
    }

    //DELETE /course/:id
    destroy(req,res,next)
    {
        
        Book.find({_id: req.params.id}, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : 'Book not found'
                })
             }
             if (result) {
                Book.findOne({_id: req.params.id})
                    .then((books) => {
                        Seller.updateOne({_id: books.sellerID}, { $inc : {productsCount : -1} }, function(err, doc) {
                        if (err) return console.error(err);
                        });
                        })
                Book.delete({_id: req.params.id})
                        .then(() => res.json({message : 'Delete book successfully'}))
                        .catch(next);
                        }
                else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Book not found'
                        })
                    }
        })


        
    }

    //DELETE /course/:id/force
    forceDestroy(req,res,next)
    {
        Book.find({_id: req.params.id}, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : 'Book not found'
                })
             }
        
            if (result) {
                Book.deleteOne({_id: req.params.id})
                    .then(() => res.json({message : 'Destroy book successfully'}))
                    .catch(next);
            } else {
                res.statusCode = 404;
                return res.json({
                    message : 'Book not found'
                })
            }
        })  
    }

     //[PATCH] /course/:id/restore
    restore(req,res,next)
    {
        Book.find({_id: req.params.id}, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : 'Book not found'
                })
             }
        
            if (result) {
                Book.restore({_id: req.params.id})
                    .then(() => res.json({message : 'Restore book successfully'}))
                    .catch(next);
            } else {
                res.statusCode = 404;
                return res.json({
                    message : 'Book not found'
                })
            }
        })  
    }
    
    byte(req,res,next)
    {
        var promises = [
            // readFromFile('C:/Users/admin/Desktop/blog/public/uploads/6d1e3256e841e87d35b4560310806dc9'),
            // readFromFile('C:/Users/admin/Desktop/blog/public/uploads/6d1e3256e841e87d35b4560310806dc9'),
            //  // ETC ...
        ];

        Book.find()
        .then(books => {
            for(var i =0; i < books.length; i++)
            {
                if (promises.length < books.length) {
                promises.push(readFromFile(path.resolve(".") + '/public' + books[i].image))
                }
            }
            console.log(promises[0])
            Promise.all(promises)
            .then(result => {
            console.log(result.length)
            res.json(result)
        });
            } )
    }

    byteSlug(req,res,next)
    {
        Book.findOne({slug : req.params.slug})
            .then(book => {
                console.log(book.image)
                    var promises = [
                        readFromFile(path.resolve(".") + '/public' + book.image),
                    ];
                Promise.all(promises)
                    .then(result => {
                        res.json(result)
                        });
                } )
    }

}

module.exports = new BooksController();