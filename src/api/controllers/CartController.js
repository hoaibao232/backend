const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const Session = require('../../app/controllers/models/Session');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Cart = require('../../app/controllers/models/Cart');
const Order = require('../../app/controllers/models/Order');
const { setCookie } = require('../../middlewares/cookie.middleware');
const express = require('express');
const cookiesMiddleware = require('universal-cookie-express');

const app = express();

class CartController {
    
    add(req,res,next)
    {
        console.log(req.headers)
        // var sessionId = req.signedCookies.sessionId;

        // // if(!sessionId)
        // // {
        // //     res.redirect('/');
        // //     return;
        // // }
        
        var cookie3 = setCookie(req)
      
      
        /* console.log(req.headers); */


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

                                Cart.findOne({productslug : req.params.slug, userID : cookie3})
                                    .then (cart1 => {
                                        var total = Math.round((req.body.quanty * cart1.price + Number.EPSILON) * 100) / 100
                                        Cart.updateOne({productslug : req.params.slug, userID : cookie3}, { $inc: {quantity : req.body.quanty, totalprice : total} }, function(err, doc) {
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
                                       /* console.log(output) */
                                        if(output.indexOf(cookie3) <= -1)
                                        {
                                            var cart2 = new Cart();
                                            cart2.productname = book.name;
                                            cart2.productID = book._id;
                                            cart2.productimage= book.image;
                                            cart2.price = book.price;
                                            cart2.userID = cookie3;
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
                        cart3.userID = cookie3;
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
    {   console.log(req.headers)
        
        /* console.log(req.universalCookies.get('userId')) */
        var cookie3 = setCookie(req)
       
        if(cookie3 !== null)
        {
            
            Book.find({deleted: {$ne: true}})
                .then(books => {
                    var output = []
                    books.forEach(function(document) {output.push(document.slug) })

                    

                    Cart.find({productslug : output, userID : cookie3})
               /*  Cart.find({​​​​​​​​ $and: [{​​​​​​​​productslug : output}​​​​​​​​, {​​​​​​​​userID : cookie3}​​​​​​​​]}​​​​​​​​) */
                        .then(carts => 
                        {
                            
                            // res.render('carts/show1', { 
                            //     carts: mutipleMongooseToObject(carts),
                            //     success:  req.session.success,
                            //     errors: req.session.errors,
                            // })
                                     
                           
                            console.log(carts)
                            res.status(202).json(carts)
                            
                            /* res.send(carts) */
                            req.session.errors = null;
                            req.session.success = null;
                            
                        })
                       
                    })
                
        }
        else {
            res.status(505)
            res.json('rong');
        }
    }

    destroy(req,res,next)
    {
        console.log(req.body.id)
    
        var cookie3 = setCookie(req)
        console.log(cookie3)

        Cart.deleteOne({_id: req.body.id, userID : cookie3})
            .then(() => res.json({message : 'delete cart successfully'}))
            .catch(next);
    }

    update(req,res,next)
    {
        
        var cookie3 = setCookie(req)
        /* req.check('quantity', '"Số lượng" phải là số! Vui lòng nhập lại! Dữ liệu vừa nhập: ').isNumeric(); */
        var errors = req.validationErrors();
        if(errors){
            console.log(errors);
            req.session.errors = errors;
            req.session.success = false;
            res.json(errors);  
         }

 
        Cart.findOne({_id: req.params.id, userID : cookie3})
            .then (cart => {
                console.log(cart)
                cart.totalprice = req.body.data.quantity * cart.price;
                
                var newtotalprice = cart.totalprice;
                req.session.success = true;
                
                Cart.updateOne({_id: req.params.id, userID : cookie3}, { $set: { quantity: req.body.data.quantity, totalprice : newtotalprice  } })
                    .then(() => res.json('Update cart successfully'))
                    .catch(next);
            })
            .catch(next); 
    }

}

module.exports = new CartController();