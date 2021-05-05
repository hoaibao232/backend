const Book = require('./models/Book');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Buyer = require('./models/Buyer');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const paypal = require('paypal-rest-sdk');
var cardId1 = [];
var name1
var addresspm1
var phone1
var address1, total1;
                                    

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
                                res.redirect('/books/'+ book.slug); 
                    }
                    else
                    {
                        var quanty = req.body.quanty;
                        Book.findOne({slug : req.params.slug})
                            .then(book => {
                                res.render('orders/createnow', {
                                    book: mongooseToObject(book),
                                    quanty : quanty,
                            })})
                    }
                
                })

       
    }

    storeNow(req,res,next)
    {
        var errors = req.validationErrors();
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
                                res.redirect('/cart/show'); 
                    }
                         else {

                            var output = 
                            {
                                quantity: req.body.quantity,
                                tittle: book.name,
                                unit_cost: book.price,
                                total_cost: req.body.totalprice,
                                sellerId: book.sellerID,
                                bookId : req.body.bookid,
                                cartId : "",
                                sellerName : book.shopname,
                            }
                       
                            req.body.userID = req.signedCookies.userId;
                            req.body.products = output;
                            req.session.success = true;
                            const order = new Order({
                                name : req.body.name,
                                address : req.body.address,
                                addresspm : req.body.addresspm,
                                phone : req.body.phone,
                                userID : req.signedCookies.userId,
                                products : output,

                            });
                            order.save();     


                                var newquantity = book.quantities - req.body.quantity;
                                Book.updateOne({_id : req.body.bookid},  { $set: {quantities : newquantity} }, function(err, doc) {
                                    if (err) return console.error(err);
                                    
                                });

                                res.redirect('/order/show');
                              
                         }        

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
      Order.find({userID : req.signedCookies.userId}).sortable(req)
                .then((orders) =>{
                    res.render('orders/show1', {
                        orders: mutipleMongooseToObject(orders),
                        success:  req.session.success,
                        errors: req.session.errors,
                    })
                    req.session.errors = null;
                    req.session.success = null;
                })
                
                .catch(next);
    }

    notApprovedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Not approved"}).sortable(req)
            .then(orders => {
                res.render('orders/orders-notapproved1', {
                orders: mutipleMongooseToObject(orders),
                })
            })    
    }

    canceledOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Canceled"}).sortable(req)
        .then(orders => {
            res.render('orders/orders-canceled1', {
            orders: mutipleMongooseToObject(orders),
            })
        })  
    }

    toShipOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Approved" }).sortable(req)
            .then(orders => {
                res.render('orders/orders-toship1', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    shippingOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "toShip" }).sortable(req)
            .then(orders => {
                res.render('orders/orders-shipping1', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    completedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Completed"}).sortable(req)
            .then(orders => {
                res.render('orders/orders-completed1', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    returnOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Return" }).sortable(req)
            .then(orders => {
                res.render('orders/orders-return', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    confirmedOrders(req,res,next)
    {
        Order.find({userID : req.signedCookies.userId, status : "Buyer-Confirmed" }).sortable(req)
            .then(orders => {
                res.render('orders/orders-confirmed', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    createMany(req,res,next)
    {
        var errors = req.validationErrors();
        Cart.find({_id: { $in : req.body.orderIds }})
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
                                res.redirect('/cart/show'); 
                                
                             }

                            i++;   
                         }

                    })
            })
            })
        Cart.find({_id: { $in : req.body.orderIds }})
             .then(carts => {
                //console.log(carts),
                res.render('orders/createmany', {
               carts: mutipleMongooseToObject(carts)
             }) })
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
                res.send('Payment Canceled')
            } else {
                console.log(JSON.stringify(payment));
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
                        res.redirect('/order/show')
                    })



        //         var books = [];
        //         Cart.find({_id: { $in : req.body.cartIds }})
        //             .then(carts => {
        //                 carts.forEach(function(document) 
        //                 {
        //                 var output = 
        //                         {
        //                             quantity: document.quantity,
        //                             tittle: document.productname,
        //                             unit_cost: document.price,
        //                             total_cost: document.totalprice,
        //                             sellerId: document.sellerID,
        //                             bookId : document.productID,
        //                             cartId : document._id,
        //                             sellerName : document.sellerName,
        //                         }
                            
        //                     //console.log(output)
        //                     //books.push(output)    
                           
        //                     req.body.userID = req.signedCookies.userId;
        //                     req.body.products = output;
        //                     req.session.success = true;
        //                     const order = new Order(req.body);
        //                     // order.save();   
                               
        //                 })

        //                 // Cart.deleteMany({_id: { $in : req.body.cartIds }})
        //                 //     .then({})
        //                 res.redirect('/order/show')
                        
           
        // })

            
        })

    }

    // storeMany(req,res,next)
    // {
    //     var errors = req.validationErrors();
    //     var flag = true;
    //     Cart.find({_id: { $in : req.body.cartIds }})
    //     .then(carts => {
    //         var output1 = [];
    //         carts.forEach(function(document) 
    //         {
    //            output1.push(document.productID);
                         
    //         })
             
    //         var i = 0;
    //         var k = 0;
            
    //                 output1.forEach(function(document)
    //             {
                    
    //                 Book.findOne({_id : document})
    //                     .then(book => {
    //                         if(k < carts.length)
    //                         {
    //                             var newquantity = book.quantities - carts[k].quantity;
    //                             Book.updateOne({_id : document},  { $set: {quantities : newquantity} }, function(err, doc) {
    //                             if (err) return console.error(err);
    //                             })    
    //                             k++;
    //                         }
                             
    //                     })
    //             })

    //             var books = [];
    //             Cart.find({_id: { $in : req.body.cartIds }})
    //                 .then(carts => {
    //                     carts.forEach(function(document) 
    //                     {
    //                     var output = 
    //                             {
    //                                 quantity: document.quantity,
    //                                 tittle: document.productname,
    //                                 unit_cost: document.price,
    //                                 total_cost: document.totalprice,
    //                                 sellerId: document.sellerID,
    //                                 bookId : document.productID,
    //                                 cartId : document._id,
    //                                 sellerName : document.sellerName,
    //                             }
                            
    //                         //console.log(output)
    //                         //books.push(output)    
                           
    //                         req.body.userID = req.signedCookies.userId;
    //                         req.body.products = output;
    //                         req.session.success = true;
    //                         const order = new Order(req.body);
    //                         order.save();   
                               
    //                     })

    //                     Cart.deleteMany({_id: { $in : req.body.cartIds }})
    //                         .then({})


    //                     //console.log(books)
    //                     // req.body.userID = req.signedCookies.userId;
    //                     // req.body.products = books;
    //                     // req.session.success = true;
    //                     // const order = new Order(req.body);
    //                     // order.save();
    //                     res.redirect('/order/show')
                        
           
    //     })

            
    //     })

    // }

    confirm(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "Buyer-Confirmed"})
            .then({})
            .catch({})
        res.redirect('back')

    }

    return(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "Return"})
            .then({})
            .catch({})
        res.redirect('back')

    }

    paymentOrders(req,res,next)
    {
        var items = [];
        var total = 0;
        var i = 0;
        cardId1 = req.body.cartIds;
        name1 = req.body.name;
        addresspm1 = req.body.addresspm,
        address1 = req.body.address,
        phone1 = req.body.phone,

        console.log(cardId1);
        Cart.find({_id: { $in : req.body.cartIds}})
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
                    "return_url": "http://localhost:3001/order/storemany",
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
                    console.log(error);
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
        res.redirect('/cart/show');
    }


}

module.exports = new OrderController();
