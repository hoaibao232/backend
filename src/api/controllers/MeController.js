const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Order = require('../../app/controllers/models/Order');
const { cookie } = require('express-validator/check');
// Order.createIndexes({ status : "text" });

class MeController {
    
    
    //[GET] /me/stored/books
    storedBooks(req,res, next)
    {
        Book.find({sellerID : req.signedCookies.sellerId}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                let bookQuery = Book.find({sellerID : req.signedCookies.sellerId})
        
                Promise.all([bookQuery, Book.countDocumentsDeleted()])
                .then(([books, deletedCount]) =>
                   res.json(books)
                )
                .catch(next);
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Books not found'
                    })
                 }   
            }
        })
       
      
    }

    inactiveBooks(req,res, next)
    {
        Book.find({sellerID : req.signedCookies.sellerId}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                
                let bookQuery = Book.find({sellerID : req.signedCookies.sellerId, quantities : 0}).sortable(req);

                Promise.all([bookQuery, Book.countDocumentsDeleted()])
                .then(([books, deletedCount]) =>
                        res.json(books)
                    )
                    .catch(next);
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Books not found'
                    })
                 }   
            }
        })   
    }

    activeBooks(req,res, next)
    {

        Book.find({sellerID : req.signedCookies.sellerId}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                
                let bookQuery = Book.find({sellerID : req.signedCookies.sellerId, quantities :{$ne : 0} }).sortable(req);

                Promise.all([bookQuery, Book.countDocumentsDeleted()])
                .then(([books, deletedCount]) =>
                    res.json(books)
                )
                .catch(next);
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Books not found'
                    })
                 }   
            }
        })
    }

    //[GET] /me/trash/courses
   trashBooks(req,res, next)
    {
        Book.findDeleted({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Book.findDeleted({})
                    .then(books => res.json(books))
                    .catch(next);
                
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Books not found'
                    })
                 }   
            }

        })
        
    }

    //[GET] /me/stored/courses/all
    allOrders(req,res, next)
    {
        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId})
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })    
                Book.find({_id : {$in : output.bookId}})
                    .then(books => {
                        console.log(books);
                    })
                    res.json(orders)
            })    
    }

    notApprovedOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Not approved" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Not approved"}).sortable(req)
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

    Approve(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "Approved"})
                    .then(() => res.json({ message : 'Approved successfully'}))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
    }

    Cancel(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "Canceled"})
                    .then(() => res.json({message : 'Cancel successfully'}))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
    }

    canceledOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Canceled" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Canceled"}).sortable(req)
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
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Approved" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Approved" })
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

    readyShip(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "toShip"})
                    .then(() => res.json({message :'readyShip successfully'}))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
    }

    shippingOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "toShip" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "toShip" }).sortable(req)
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

    completed(req,res,next)
    {
        Order.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Order not found'
                })
             }
        
            if (result) {
                Order.updateOne({_id: req.params.id }, {status : "Completed"})
                    .then({})
                    .catch({})
                Order.findOne({_id: req.params.id })
                    .then(order => {
                    Book.findOne({_id: order.products[0].bookId})
                        .then(book => {
                            var totalSold = book.sold + order.products[0].quantity;
                            Book.updateOne({_id: order.products[0].bookId }, {sold : totalSold })
                                .then({})
                                .catch({})
                        })

                    res.json('completed')
                })
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Order not found'
                    })
            }
        })
        
    }

    completedOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, $or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, $or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }).sortable(req)
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
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Return" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Return" }).sortable(req)
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

     // me/stored/handle-form-actions
     handleFormActions(req,res,next)
     {
        //console.log(req.body.orderIds); 
        switch(req.body.action) {
             case 'approve':
                Order.updateMany({_id: { $in : req.body.orderIds }}, {status : "Approved"})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;

             case 'cancel':
                Order.updateMany({_id: { $in : req.body.orderIds }}, {status : "Canceled"})
                    .then(() => res.redirect('back'))
                    .catch(next);
                 break;

             case 'toship':
                Order.updateMany({_id: { $in : req.body.orderIds }}, {status : "toShip"})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            case 'complete':
                Order.updateMany({_id: { $in : req.body.orderIds }}, {status : "Completed"})
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
             default: 
 
         }
     }

     paymentPaid(req,res,next)
     {
        // // Website you wish to allow to connect
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

        // // Request methods you wish to allow
        // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // // Request headers you wish to allow
        // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // // Set to true if you need the website to include cookies in the requests sent
        // // to the API (e.g. in case you use sessions)
        // res.setHeader('Access-Control-Allow-Credentials', true);


        Order.aggregate([
                {$match : { $and : [ {'products.sellerId' : req.signedCookies.sellerId}, {status : "Buyer-Confirmed"}]  }},
                {
                    $unwind: "$products"
                },
                {$group : 
                {
                    _id: "$products.sellerId",
                    totalPaid : {$sum : "$products.total_cost"}}
                }
                ])
            .then(result => {
                if(!result[0])
                {
                    res.locals.totalPaid = 0;
                }
                else{
                    res.locals.totalPaid = result[0].totalPaid;
                }
            })

         Order.aggregate([
                {$match : { $and : [ {'products.sellerId' : req.signedCookies.sellerId}, {status : "Completed"}]  }},
                {
                    $unwind: "$products"
                },
                {$group : 
                {
                    _id: "$products.sellerId",
                    totalUnpaid : {$sum : "$products.total_cost"}}
                }
            ])
                .then(result => {
                    if(!result[0])
                    {
                        res.locals.totalUnpaid = 0;
                    }
                    else{
                        res.locals.totalUnpaid = result[0].totalUnpaid;
                    }
                   
                })
                .catch(next);
        
        
        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Buyer-Confirmed"}).sortable(req)
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })
                res.json({
                    order : orders,
                    totalPaid : res.locals.totalPaid,
                    totalUnpaid : res.locals.totalUnpaid,
                });
            })  


     }

     paymentUnpaid(req,res,next)
     {

        Order.aggregate([
            {$match : { $and : [ {'products.sellerId' : req.signedCookies.sellerId}, {status : "Buyer-Confirmed"}]  }},
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$products.sellerId",
                totalPaid : {$sum : "$products.total_cost"}}
            }
            ])
        .then(result => {
            // res.locals.totalPaid = result[0].totalPaid;
                if(!result[0])
                {
                    res.locals.totalPaid = 0;
                }
                else{
                    res.locals.totalPaid = result[0].totalPaid;
                }
        })
        // {status : {$ne : "Completed"}}

        Order.aggregate([
            {$match : { $and : [ {'products.sellerId' : req.signedCookies.sellerId}, {status : "Completed"}] }},
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$products.sellerId",
                totalUnpaid : {$sum : "$products.total_cost"}}
            }
        ])
            .then(result => {
                // res.locals.totalUnpaid = result[0].totalUnpaid;
                 if(!result[0])
                    {
                        res.locals.totalUnpaid = 0;
                    }
                    else{
                        res.locals.totalUnpaid = result[0].totalUnpaid;
                    }
            })

        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Completed"}).sortable(req)
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })
                res.json({
                    order : orders,
                    totalPaid : res.locals.totalPaid,
                    totalUnpaid : res.locals.totalUnpaid,
                });
            })    
     }

     searchOrders(req,res,next)
     {
        var searchQuery = req.query.search;
        console.log(searchQuery)
        Order.find( {$text:{$search : searchQuery}, 'products.sellerId' : req.signedCookies.sellerId})
            .then(orders => {
                console.log(orders)
                res.render('me/stored-orders-search', {
                    orders : mutipleMongooseToObject(orders),
                })
            })
     }

}

module.exports = new MeController();