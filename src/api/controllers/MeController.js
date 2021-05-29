const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Order = require('../../app/controllers/models/Order');

const { cookie } = require('express-validator/check');
const { setCookie } = require('../../middlewares/cookie.middleware');
// Order.createIndexes({ status : "text" });

class MeController {
    
    
    //[GET] /me/stored/books
    storedBooks(req,res, next)
    {
        var cookie3 = setCookie(req)
        Book.find({sellerID : cookie3}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                let bookQuery = Book.find({sellerID : cookie3}).sortable(req)
        
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
        var cookie3 = setCookie(req)
        Book.find({sellerID : cookie3}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                
                let bookQuery = Book.find({sellerID : cookie3, quantities : 0}).sortable(req);

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
        var cookie3 = setCookie(req)
        Book.find({sellerID : cookie3}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                
                let bookQuery = Book.find({sellerID : cookie3, quantities :{$ne : 0} }).sortable(req);

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
        var cookie3 = setCookie(req)
        Book.findDeleted({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Book.findDeleted({}).sortable(req)
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
        console.log(req)
        var cookie3 = setCookie(req);
        console.log(cookie3)
        var output = []
        Order.find({'products.sellerId' : cookie3}).sortable(req)
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })    
                Book.find({_id : {$in : output.bookId}})
                    .then(books => {
                        console.log(books);
                    })
                    console.log(orders)
                    res.json(orders)
            })    
    }

    notApprovedOrders(req,res,next)
    {
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, status : "Not approved" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, status : "Not approved"}).sortable(req)
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
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, status : "Canceled" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, status : "Canceled"}).sortable(req)
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
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, status : "Approved" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, status : "Approved" }).sortable(req)
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
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, status : "toShip" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, status : "toShip" }).sortable(req)
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

                    res.json({
                        message : 'completed'
                    })
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
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, $or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, $or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }).sortable(req)
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
        var cookie3 = setCookie(req);
        Order.find({'products.sellerId' : cookie3, status : "Return" }, function(err, result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
        
            if (result) {
                Order.find({'products.sellerId' : cookie3, status : "Return" }).sortable(req)
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

        var cookie3 = setCookie(req);

        Order.aggregate([
                {$match : { $and : [ {'products.sellerId' : cookie3}, {status : "Buyer-Confirmed"}]  }},
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
                {$match : { $and : [ {'products.sellerId' : cookie3}, {status : "Completed"}]  }},
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
        Order.find({'products.sellerId' : cookie3, status : "Buyer-Confirmed"}).sortable(req)
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

        var cookie3 = setCookie(req);
        Order.aggregate([
            {$match : { $and : [ {'products.sellerId' : cookie3}, {status : "Buyer-Confirmed"}]  }},
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
            {$match : { $and : [ {'products.sellerId' : cookie3}, {status : "Completed"}] }},
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
        Order.find({'products.sellerId' : cookie3, status : "Completed"}).sortable(req)
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
        var cookie3 = setCookie(req);
        var searchQuery = req.query.search;
        console.log('111111111')
        Order.find( {$text:{$search : searchQuery}, 'products.sellerId' : cookie3})
            .then(orders => {
                console.log(orders)
                res.render('me/stored-orders-search', {
                    orders : mutipleMongooseToObject(orders),
                })
            })
     }

}

module.exports = new MeController();