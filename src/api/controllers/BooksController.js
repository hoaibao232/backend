const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const  { mongooseToObject } = require('../../util/mongoose');
const fs = require('fs')

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
        console.log(req.signedCookies.sellerId);
        Seller.findOne({_id: req.signedCookies.sellerId})
            .then(seller => {
                var imagestr = "\\" + req.file.path.split('\\').slice(1).join('\\');
                req.body.image = imagestr.replace(/\\/g,'/'),
                req.body.sellerID = req.signedCookies.sellerId;
                req.body.shopname = seller.shopname;
                const book = new Book(req.body);
                book.save()
                    .then(() => {
                    
                        Seller.updateOne({_id: req.signedCookies.sellerId }, { $inc: {productsCount : 1} }, function(err, doc) {
                            if (err) return console.error(err);
                          });
                        
                     res.json({message : 'Add product successfully'}) 
                    }
                    )
                    .catch(error => {});
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

    sendFile(req,res,next)
    {
        // Book.find({})
        //     .then(books => {
                // res.readFile("C:/Users/admin/Desktop/blog" + "/public/uploads/2cf6056cc58d527307537b09f1102a4d");
                
                    fs.readFile("C:/Users/admin/Desktop/blog/public/uploads/2cf6056cc58d527307537b09f1102a4d", 'utf8' , (err, data) => {
                    if (err) {
                        console.error(err)
                        return
                    }
                    res.json(data)
                    })
    //         })
    }

}

module.exports = new BooksController();