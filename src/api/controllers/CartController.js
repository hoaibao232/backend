const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const Session = require('../../app/controllers/models/Session');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Cart = require('../../app/controllers/models/Cart');
const Order = require('../../app/controllers/models/Order');

class CartController {
    
    add(req,res,next)
    {
        // var sessionId = req.signedCookies.sessionId;

        // // if(!sessionId)
        // // {
        // //     res.redirect('/');
        // //     return;
        // // }
        
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
                                        var total = Math.round((req.body.quanty * cart1.price + Number.EPSILON) * 100) / 100
                                        Cart.updateOne({productslug : req.params.slug, userID : req.signedCookies.userId}, { $inc: {quantity : req.body.quanty, totalprice : total} }, function(err, doc) {
                                            if (err) return console.error(err);
                                            
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
                                            cart2.totalprice = Math.round((cart2.quantity * cart2.price + Number.EPSILON) * 100) / 100;
                                            cart2.save(function(err, doc) 
                                            {
                                            if (err) return console.error(err);
                                            
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
                        cart3.totalprice = Math.round((cart3.quantity * cart3.price + Number.EPSILON) * 100) / 100;
                        cart3.save(function(err, doc) 
                        {
                         if (err) return console.error(err);
                         
                        })
                    }

                })
                 res.json({
                     message : 'Add product to cart successfully'
                 });
        })
               
            .catch(next);
            
    }


    show(req,res, next)
    {
        Book.find({deleted: {$ne: true}})
            .then(books => {
                var output = []
                books.forEach(function(document) {output.push(document.slug) }),
                Cart.find({productslug : output, userID : req.signedCookies.userId})
                    .then(carts => 
                    {
                        // res.render('carts/show1', { 
                        //     carts: mutipleMongooseToObject(carts),
                        //     success:  req.session.success,
                        //     errors: req.session.errors,
                        // })
                        res.json(carts)
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
            .then(() => res.json({message : 'delete cart successfully'}))
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
            res.json(errors);  
         }

        Cart.findOne({_id: req.params.id, userID : req.signedCookies.userId})
            .then (cart => {
                cart.totalprice = req.body.quantity * cart.price;
                
                var newtotalprice = cart.totalprice;
                req.session.success = true;
                
                Cart.updateOne({_id: req.params.id, userID : req.signedCookies.userId}, { $set: { quantity: req.body.quantity, totalprice : newtotalprice  } })
                    .then(() => res.json('Update cart successfully'))
                    .catch(next);
            })
            .catch(next); 
    }

}

module.exports = new CartController();