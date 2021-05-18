const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Cart = require('../../app/controllers/models/Cart');
const Order = require('../../app/controllers/models/Order');
const paypal = require('paypal-rest-sdk');
var cardId1 = [];
var name1
var addresspm1
var phone1
var address1, total1;
var name2,addresspm2,phone2,address2,total2,bookID,quantity2,totalprice2;

class OrderController {
    
    create(req,res,next)
    {
        Cart.findById(req.params.id)
            .then(cart => res.render('orders/create', {
                cart: mongooseToObject(cart)
            }))
            .catch(next);
        //res.render('orders/create');
    }

    createNow(req,res,next)
    {
        var errors = req.validationErrors();
        Book.findOne({slug : req.params.slug})
            .then(book => {
                if((req.body.quanty > book.quantities) || ( book.quantities <= 0))
                    {
                            var error = {location: 'body', param: "quantity", msg: `Số lượng tối đa sản phẩm ${book.name} có thể đặt: `, value: book.quantities};
                               
                                if (!errors)
                                {
                                    errors = [];
                                }
                                errors.push(error);
                                console.log(errors);
                                req.session.errors = errors;
                                req.session.success = false;
                                // res.redirect('/books/'+ book.slug); 
                                res.json(error);
                    }
                    else
                    {
                        var quanty = req.body.quanty;
                        Book.findOne({slug : req.params.slug})
                            .then(book => {
                            //     res.render('orders/createnow', {
                            //         book: mongooseToObject(book),
                            //         quanty : quanty,
                            // })
                            res.json({
                                book : book,
                                quantity : req.body.quanty,
                            })
                        })
                    }
                
                })

       
    }

    storeNow(req,res,next)
    {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": totalprice2.toString()
                }
            }]
          };

          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                res.json('Payment canceled')
            } else {
                // console.log(JSON.stringify(payment));
                res.json('Payment successfully!')
            }
        });

        var errors = req.validationErrors();
        req.body.userID = req.signedCookies.userId;
        Book.findOne({_id : bookID})
            .then(book => {
                            var output = 
                            {
                                quantity: quantity2,
                                tittle: book.name,
                                unit_cost: book.price,
                                total_cost: totalprice2,
                                sellerId: book.sellerID,
                                bookId : bookID,
                                cartId : "",
                                sellerName : book.shopname,
                            }
                       
                            var userID = req.signedCookies.userId;
                            req.session.success = true;
                            const order = new Order({
                                name : name2,
                                address : address2,
                                addresspm : addresspm2,
                                phone : phone2,
                                userID : userID,
                                products : output,
                                payment : totalprice2,
                                sellerID : book.sellerID,
                                sellerName : book.shopname,
                                paymentID : paymentId,

                            });
                                order.save();     
                                var newquantity = book.quantities - req.body.quantity;
                                Book.updateOne({_id : req.body.bookid},  { $set: {quantities : newquantity} }, function(err, doc) {
                                    if (err) return console.error(err);
                                    
                                });
                                res.json('Buy now successfully')                       
            })
    }

    store(req,res,next)
    {
        var errors = req.validationErrors();
        req.body.userID = req.signedCookies.userId;
       
        Cart.findOne({_id : req.body.cartID})
            .then(cart => {
                req.body.sellerID = cart.sellerID
                req.body.productID = cart.productID;
                
                Book.findOne({_id : req.body.productID})
                    .then(book => {
                        if((cart.quantity > book.quantities) || ( book.quantities <= 0))
                        {
                            var error = {location: 'body', param: "quantity", msg: "Số lượng tối đa sản phẩm có thể mua: ", value: book.quantities};
                               
                                if (!errors)
                                {
                                    errors = [];
                                }
                                errors.push(error);
                                console.log(errors);
                                req.session.errors = errors;
                                req.session.success = false;
                                res.redirect('/cart/show'); 
                         }
                         else {
                            const order = new Order(req.body);
                            Cart.delete({_id : req.body.cartID})
                                .then({})

                                var newquantity = book.quantities - cart.quantity;
                        
                                Book.updateOne({_id : cart.productID},  { $set: {quantities : newquantity} }, function(err, doc) {
                                    if (err) return console.error(err);
                                    
                                });
                                console.log("OKAY");
                                req.session.success = true;
                                order.save();
                                res.redirect('/order/show'); 

                         }
                    })
                 })
        
             }


    show(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId}).sortable(req)
                    .then((orders) =>{
                        // res.render('orders/show1', {
                        //     orders: mutipleMongooseToObject(orders),
                        //     success:  req.session.success,
                        //     errors: req.session.errors,
                        // })
                        res.json(orders)
                        req.session.errors = null;
                        req.session.success = null;
                    })
                    .catch(next);  
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })     
    }

    notApprovedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Not approved"}, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Not approved"}).sortable(req)
                    .then(orders => {
                        res.json(orders)
                    })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })     
    }

    canceledOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Canceled" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Canceled"}).sortable(req)
                .then(orders => {
                    res.json(orders)
                })      
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })     
    }

    toShipOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Approved" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Approved" }).sortable(req)
                .then(orders => {
                    res.json(orders)
            })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })   
    }

    shippingOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "toShip" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "toShip" }).sortable(req)
                .then(orders => {
                    res.json(orders)
            })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })   
    }

    completedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Completed" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Completed" }).sortable(req)
                .then(orders => {
                    res.json(orders)
            })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })   
    }

    returnOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Return" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Return" }).sortable(req)
                .then(orders => {
                    res.json(orders)
            })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })   
    }

    confirmedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Buyer-Confirmed" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({userID : req.signedCookies.userId, status : "Buyer-Confirmed" }).sortable(req)
                .then(orders => {
                    res.json(orders)
            })    
            } else {
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
            }
        })   
    }

    createMany(req,res,next)
    {
        console.log(req.body.data)
        var errors = req.validationErrors();
        
        Cart.find({_id: { $in : req.body.data.orderIds}})
            .then(carts => {
                var output1 = [];
                carts.forEach(function(document) 
                {
                   output1.push(document.productID);
                             
                })

                var i = 0;
                output1.forEach(function(document)
                {
                    
                Book.findOne({_id : document})
                    .then(book => {
                        if(i < carts.length)
                        {
                            if((carts[i].quantity > book.quantities) || ( book.quantities <= 0))
                            {
                                var error = {location: 'body', param: "quantity", msg: `Số lượng tối đa sản phẩm ${carts[i].productname} có thể mua: `, value: book.quantities};
                               
                                if (!errors)
                                {
                                    errors = [];
                                }
                                errors.push(error);
                                console.log(errors);
                                req.session.errors = errors;
                                req.session.success = false;
                                res.json(error); 
                             }

                            i++;   
                         }

                    })
            })
            })
         Cart.find({_id: { $in : req.body.data.orderIds }})
             .then(carts => {
            //     res.render('orders/createmany', {
            //    carts: mutipleMongooseToObject(carts)
            //  }) 
                /* console.log(carts) */
                res.json(carts)
            })
                   .catch(next);
              
    }
    
    storeMany(req,res,next)
    {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id": payerId,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": total1.toString()
                }
            }]
          };

          paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                res.json({message : 'Payment Canceled'})
            } else {
                res.json(JSON.stringify(payment));
            }
        });


        var errors = req.validationErrors();
        var flag = true;
        Cart.find({_id: { $in : cardId1 }})
        .then(carts => {
            var output1 = [];
            carts.forEach(function(document) 
            {
               output1.push(document.productID);
                         
            })
             
            var i = 0;
            var k = 0;
            
                    output1.forEach(function(document)
                {
                    
                    Book.findOne({_id : document})
                        .then(book => {
                            if(k < carts.length)
                            {
                                var newquantity = book.quantities - carts[k].quantity;
                                Book.updateOne({_id : document},  { $set: {quantities : newquantity} }, function(err, doc) {
                                if (err) return console.error(err);
                                })    
                                k++;
                            }
                             
                        })
                })
                
                Cart.aggregate([
                    { $group: { 
                        _id: "$sellerID",
                        count: { $sum:  1 },
                        docs: { $push: "$_id"}
                    }},
                    { $match: {
                        count: { $gt : 0 },
                        // _id: { $in : req.body.cartIds }
                    }}
                ])
                    .then(result => {
                        // console.log(result)
                        result.forEach(function(group) {
                        var kk = [];
                        var total = 0;
                        var sellername;
                        Cart.find({ $and : [ {_id: { $in : group.docs }}, {_id: { $in : cardId1 }}]   })
                            .then(carts => {
                                carts.forEach(function(document) {
                                    var output = 
                                {
                                    quantity: document.quantity,
                                    tittle: document.productname,
                                    unit_cost: document.price,
                                    total_cost: document.totalprice,
                                    sellerId: document.sellerID,
                                    bookId : document.productID,
                                    cartId : document._id,
                                    
                                }
                                    kk.push(output);
                                    total = total + document.totalprice;
                                    sellername = document.sellerName;
                                })

                                // console.log(kk);
                                // console.log(group._id);
                                if(kk.length != 0)
                                {
                                    var order1 = new Order(
                                        {
                                            name : name1,
                                            address : address1,
                                            addresspm : addresspm1,
                                            phone : phone1,
                                            userID : req.signedCookies.userId,
                                            products : kk,
                                            sellerID : group._id,
                                            payment : total,
                                            sellerName : sellername,
                                            paymentID : paymentId,
                                        }
                                    );
                                    order1.save();
                                    req.session.success = true;
                                }
                            })
                        })
                        Cart.deleteMany({_id: { $in : cardId1 }})
                            .then({})
                        res.json({message : 'Order many successfully'})
                    })            
        })

    }

    confirm(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "Buyer-Confirmed"})
                    .then(() => res.json({message : 'Comfirm successfully'}))
                    .catch({})
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
    }

    return(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "Return"})
                    .then(() => res.json({message : 'Returned successfully'}))
                    .catch({})
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
    }

    paymentOrders(req,res,next)
    {   
        console.log(req.body.data.cartIds)
        var items = [];
        var total = 0;
        var i = 0;
        cardId1 = req.body.data.cartIds;
        name1 = req.body.data.name;
        addresspm1 = req.body.data.addresspm,
        address1 = req.body.data.address,
        phone1 = req.body.data.phone,

        Cart.find({_id: { $in : req.body.data.cartIds}})
        .then(carts => {
            carts.forEach(function(document) {
                i++;
                var output = 
            {
                name: document.productname,
                sku : `#00${i}`,
                price: document.price.toString(),
                currency : "USD",
                quantity: document.quantity,
            }
                items.push(output);
                total = total + document.totalprice;
               
            })
            total1 = total;
            console.log(items);
            console.log(total);
            const create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "http://localhost:3001/api/order/storemany",
                    "cancel_url": "http://localhost:3001/api/paypal/cancel"
                },
                "transactions": [{
                    "item_list": {
                        "items": items
                    },
                    "amount": {
                        "currency": "USD",
                        "total": total.toString()
                    },
                    "description": "Hat for the best team ever"
                }]
            }

            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    res.json(error);
                } else {
                    for(let i = 0;i < payment.links.length;i++){
                        if(payment.links[i].rel === 'approval_url'){
                          res.redirect(payment.links[i].href);
                        }}
                }
            });
        })

    }

    paypalCancel(req,res,next)
    {
        // res.redirect('/cart/show');
        res.json({message : "Paypal payment cancel"})
    }

    paymentOrderNow(req,res,next)
    {
        var errors = req.validationErrors();
        bookID = req.body.bookid;
        req.body.userID = req.signedCookies.userId;
        Book.findOne({_id : req.body.bookid})
            .then(book => {
                // req.body.sellerID = book.sellerID;
                // req.body.productID = req.body.bookid;

                if((req.body.quantity > book.quantities) || ( book.quantities <= 0))
                    {
                            var error = {location: 'body', param: "quantity", msg: "Số lượng tối đa sản phẩm có thể đặt: ", value: book.quantities};
                               
                                if (!errors)
                                {
                                    errors = [];
                                }
                                errors.push(error);
                                console.log(errors);
                                req.session.errors = errors;
                                req.session.success = false;
                                res.json(error);
                    }
                         else {
                            var items = [];
                            var total = 0;
                            var i = 1;
                            name2 = req.body.name;
                            addresspm2 = req.body.addresspm;
                            address2 = req.body.address;
                            phone2 = req.body.phone;
                            quantity2 = req.body.quantity;
                            totalprice2 = req.body.totalprice;

                            var output = 
                            {
                                // quantity: req.body.quantity,
                                // tittle: book.name,
                                // unit_cost: book.price,
                                // total_cost: req.body.totalprice,
                                // sellerId: book.sellerID,
                                // bookId : req.body.bookid,
                                // cartId : "",
                                // sellerName : book.shopname,

                                name: book.name,
                                sku : `#${i}`,
                                price: book.price.toString(),
                                currency : "USD",
                                quantity: req.body.quantity,
                            }
                             items.push(output);
                             total = req.body.totalprice;
                             total2 = total;

                             const create_payment_json = 
                             {
                                "intent": "sale",
                                "payer": {
                                    "payment_method": "paypal"
                                },
                                "redirect_urls": {
                                    "return_url": "http://localhost:3001/order/storenow",
                                    "cancel_url": "http://localhost:3001/paypal/cancel"
                                },
                                "transactions": [{
                                    "item_list": {
                                        "items": items
                                    },
                                    "amount": {
                                        "currency": "USD",
                                        "total": total.toString()
                                    },
                                    "description": "Hat for the best team ever"
                                }]
                            }

                            paypal.payment.create(create_payment_json, function (error, payment) {
                                if (error) {
                                    res.json(error);
                                } else {
                                    for(let i = 0;i < payment.links.length;i++){
                                        if(payment.links[i].rel === 'approval_url'){
                                          res.redirect(payment.links[i].href);
                                        }}
                                }
                            });
                              
                         }        

            })

    }

}

module.exports = new OrderController();
