const Book = require('./models/Book');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const Buyer = require('./models/Buyer');
const Session = require('./models/Session');
const Cart = require('./models/Cart');

class CartController {
    
    add(req,res,next)
    {
        var sessionId = req.signedCookies.sessionId;

        if(!sessionId)
        {
            res.redirect('/');
            return;
        }
        
        Book.findOne({slug : req.params.slug})
            .then (book => {
                Cart.find({productslug : req.params.slug}, function(err, cart) {
                    if (err) { return console.error(err); }
                    else if (cart) //SAN PHAM TON TAI TRONG CART
                    {
                        //USER DA CO SP NAY TRONG CART
                                var output = []
                                
                                cart.forEach(function(document) {output.push(document.userID) }),
                                //console.log(output),

                                Cart.findOne({productslug : req.params.slug, userID : req.signedCookies.userId})
                                    .then (cart1 => {
                                        var total = parseFloat((req.body.quanty * cart1.price).toFixed(2));
                                        console.log(total);
                                        Cart.updateOne({productslug : req.params.slug, userID : req.signedCookies.userId}, { $inc: {quantity : req.body.quanty, totalprice : total} }, function(err, doc) {
                                            if (err) return console.error(err);
                                            console.log("Update cart successfully!");
                                          });
                                    })
            
                        //USER CHUA CO SP NAY TRONG CART
                                Cart.find({productslug : req.params.slug}, function(err, doc) {
                                    if (err) { return console.error(err); }
                                    else if (doc)
                                    {
                                        var output = []
                                       cart.forEach(function(document) {output.push(document.userID)})
                                       console.log(output)
                                        if(output.indexOf(req.signedCookies.userId) <= -1)
                                        {
                                            var cart2 = new Cart();
                                            cart2.productname = book.name;
                                            cart2.productID = book._id;
                                            cart2.productimage= book.image;
                                            cart2.price = book.price;
                                            cart2.userID = req.signedCookies.userId;
                                            cart2.sellerID = book.sellerID;
                                            cart2.sellerName = book.shopname;
                                            cart2.productslug = book.slug;
                                            cart2.quantity = req.body.quanty;
                                            cart2.totalprice = parseFloat((cart2.quantity * cart2.price).toFixed(2));
                                            cart2.save(function(err, doc) 
                                            {
                                            if (err) return console.error(err);
                                            console.log("Cart inserted succussfully!");
                                            })
                                        }
                                    }
                                }                          
                                )   
                    }

                    else {
                        var cart3 = new Cart();
                        cart3.productname = book.name;
                        cart3.productID = book._id;
                        cart3.productimage= book.image;
                        cart3.price = book.price;
                        cart3.userID = req.signedCookies.userId;
                        cart3.sellerID = book.sellerID;
                        cart3.sellerName = book.shopname;
                        cart3.productslug = book.slug;
                        cart3.quantity = 1;
                        cart3.totalprice = parseFloat((cart3.quantity * cart3.price).toFixed(2));
                        cart3.save(function(err, doc) 
                        {
                         if (err) return console.error(err);
                         console.log("Document inserted succussfully!");
                        })
                    }

                })
                 res.redirect('back');
        })
               
            .catch(next);
            
    }

    // add(req,res,next)
    // {
    //     var sessionId = req.signedCookies.sessionId;

    //     if(!sessionId)
    //     {
    //         res.redirect('/');
    //         return;
    //     }
        
    //     Book.findOne({slug : req.params.slug})
    //         .then (book => {
    //             Cart.find({productslug : book.slug}, function(err, doc) {
    //                 if (err) { return console.error(err); }
    //                 else if (doc)
    //                 {
    //                     //USER DA CO SP NAY TRONG CART
                        
    //                     Cart.find({productslug : book.slug})
    //                         .then(cart => {
                               
    //                             var quantityy = cart.quantity
    //                             var output = []
                                
    //                             cart.forEach(function(document) {output.push(document.userID) }),
    //                             //console.log(output),

    //                             Cart.findOne({productslug : book.slug, userID : req.signedCookies.userId})
    //                                 .then (cart1 => {
    //                                     Cart.updateOne({productslug : book.slug, userID : req.signedCookies.userId}, { $inc: {quantity : req.body.quanty, totalprice : req.body.quanty * cart1.price} }, function(err, doc) {
    //                                         if (err) return console.error(err);
    //                                         console.log("Document inserted succussfully!");
    //                                       });
    //                                 })
                               
    //                         })
    //                         .catch(next);
                            
    //                     //USER CHUA CO SP NAY TRONG CART
    //                     Book.findOne({slug : req.params.slug})
    //                         .then (book => {
    //                             Cart.find({productslug : book.slug}, function(err, doc) {
    //                                 if (err) { return console.error(err); }
    //                                 else if (doc)
    //                                 {
    //                                     var output = []
    //                                    doc.forEach(function(document) {output.push(document.userID)})
    //                                    console.log(output)
    //                                     if(output.indexOf(req.signedCookies.userId) <= -1)
    //                                     {
    //                                         var cart = new Cart();
    //                                         cart.productname = book.name;
    //                                         cart.productID = book._id;
    //                                         cart.productimage= book.image;
    //                                         cart.price = book.price;
    //                                         cart.userID = req.signedCookies.userId;
    //                                         cart.sellerID = book.sellerID;
    //                                         cart.sellerName = book.shopname;
    //                                         cart.productslug = book.slug;
    //                                         cart.quantity = req.body.quanty;
    //                                         cart.totalprice = cart.quantity * cart.price;
    //                                         cart.save(function(err, doc) 
    //                                         {
    //                                         if (err) return console.error(err);
    //                                         console.log("Document inserted succussfully!");
    //                                         })

    //                                     }
    //                                 }
    //                             }
                            
    //                             )
    //                         })
                            
                                
                            
    //                 }

    //                 else {
    //                     var cart = new Cart();
    //                     cart.productname = book.name;
    //                     cart.productID = book._id;
    //                     cart.productimage= book.image;
    //                     cart.price = book.price;
    //                     cart.userID = req.signedCookies.userId;
    //                     cart.sellerID = book.sellerID;
    //                     cart.sellerName = book.shopname;
    //                     cart.productslug = book.slug;
    //                     cart.quantity = 1;
    //                     cart.totalprice = cart.quantity * cart.price;
    //                     cart.save(function(err, doc) 
    //                     {
    //                      if (err) return console.error(err);
    //                      console.log("Document inserted succussfully!");
    //                     })
    //                     //console.log(cart);
    //                 }

    //             })

    //             // Cart.findOne({productslug : book.slug, userID : req.signedCookies.userId})
    //             //     .then(cart => {
    //             //         var totalpricee = cart.price * (cart.quantity);
    //             //         console.log(totalpricee);
    //             //         Cart.updateOne({productslug : book.slug, userID : req.signedCookies.userId}, { $set: {totalprice : totalpricee} }, function(err, doc) {
    //             //             if (err) return console.error(err);
    //             //             console.log("Document inserted succussfully!");
    //             //           });
    //             //     })
    //             //     .catch({})
               
               
 
    //              res.redirect('back');
    //     })
               
    //         .catch(next);
            
    // }

    show(req,res, next)
    {
        // Cart.aggregate([
        //     { $group: { 
        //         // Group by fields to match on (a,b)
        //         _id: { sellerID: "$sellerID"},
        
        //         // Count number of matching docs for the group
        //         count: { $sum:  1 },
        
        //         // Save the _id for matching docs
        //         docs: { $push: "$_id"}
        //     }},
        
        //     // Limit results to duplicates (more than 1 match) 
        //     { $match: {
        //         count: { $gt : 1 },
        //     }}
        // ])
        //     .then(result => console.log(result[0]))

        Book.find({deleted: {$ne: true}})
            .then(books => {
                var output = []
                books.forEach(function(document) {output.push(document.slug) }),
                console.log(output),
                Cart.find({productslug : output, userID : req.signedCookies.userId})
                    .then(carts => 
                    {
                        console.log(carts);
                        res.render('carts/show1', { 
                            carts: mutipleMongooseToObject(carts),
                            success:  req.session.success,
                            errors: req.session.errors,
                        })
                        req.session.errors = null;
                        req.session.success = null;
                    })
                    .catch(next);
                 })
            .catch(next);
    }

    destroy(req,res,next)
    {
       Cart.deleteOne({_id: req.params.id, userID : req.signedCookies.userId})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    update(req,res,next)
    {
        req.check('quantity', '"Số lượng" phải là số! Vui lòng nhập lại! Dữ liệu vừa nhập: ').isNumeric();
        var errors = req.validationErrors();
        if(errors){
            console.log(errors);
            req.session.errors = errors;
            req.session.success = false;
            res.redirect('/cart/show');   
         }

        Cart.findOne({_id: req.params.id, userID : req.signedCookies.userId})
            .then (cart => {
                cart.totalprice = parseFloat((req.body.quantity * cart.price).toFixed(2));
                
                var newtotalprice = cart.totalprice;
                req.session.success = true;
                
                Cart.updateOne({_id: req.params.id, userID : req.signedCookies.userId}, { $set: { quantity: req.body.quantity, totalprice : newtotalprice  } })
                    .then(() => res.redirect('/cart/show'))
                    .catch(next);
            })
            .catch(next); 
    }

}

module.exports = new CartController();