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
        let bookQuery = Book.find({sellerID : req.signedCookies.sellerId})
        
                Promise.all([bookQuery, Book.countDocumentsDeleted()])
                .then(([books, deletedCount]) =>
                   res.json(books)
                )
                .catch(next);
  
    }

    inactiveBooks(req,res, next)
    {
        let bookQuery = Book.find({sellerID : req.signedCookies.sellerId, quantities : 0}).sortable(req);

        Promise.all([bookQuery, Book.countDocumentsDeleted()])
        .then(([books, deletedCount]) =>
                res.json(books)
        )
        .catch(next);
        
    }

    activeBooks(req,res, next)
    {
        let bookQuery = Book.find({sellerID : req.signedCookies.sellerId, quantities :{$ne : 0} }).sortable(req);

        Promise.all([bookQuery, Book.countDocumentsDeleted()])
        .then(([books, deletedCount]) =>
            res.json(books)
        )
        .catch(next);
    }

    //[GET] /me/trash/courses
   trashBooks(req,res, next)
    {
        Book.findDeleted({}).sortable(req)
            .then(books => res.json(books))
            .catch(next);
        
    }

    //[GET] /me/stored/courses/all
    allOrders(req,res, next)
    {
        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId})
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })
                //console.log(orders.products),

                // var produdctIDs = output.map(function(products){ return products.quantity})
                // console.log(produdctIDs)

                Book.find({_id : {$in : output.bookId}})
                    .then(books => {
                        console.log(books);
                    })
                    res.json(orders)
            })    
    }

    notApprovedOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Not approved"}).sortable(req)
            .then(orders => {
                res.json(orders)
            })    
    }

    Approve(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "Approved"})
            .then(() => res.json('Approved'))
            .catch(next);
    }

    Cancel(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "Canceled"})
            .then(() => res.json('Canceled'))
            .catch(next);
    }

    canceledOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Canceled"}).sortable(req)
        .then(orders => {
            res.json(orders)
        })  
    }

    toShipOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Approved" }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    readyShip(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "toShip"})
            .then(() => res.json('readyShip'))
            .catch(next);
    }

    shippingOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "toShip" }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    completed(req,res,next)
    {
        Order.updateOne({_id: req.params.id }, {status : "Completed"})
            .then({})
            .catch({})

        Order.findOne({_id: req.params.id })
            .then(order => {
                
                
                    
                Book.findOne({_id: order.products[0].bookId})
                    .then(book => {
                        var totalSold = book.sold + order.products[0].quantity;
                        console.log(totalSold)
                        Book.updateOne({_id: order.products[0].bookId }, {sold : totalSold })
                            .then({})
                            .catch({})
                    })

                res.json('completed')
            })
        
    }

    completedOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, $or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    returnOrders(req,res,next)
    {
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Return" }).sortable(req)
            .then(orders => {
                res.json(orders)
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
                // res.json(result[0].totalPaid);
                res.locals.totalPaid = result[0].totalPaid;
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
                    // res.json(result[0].totalUnpaid);
                    res.locals.totalUnpaid = result[0].totalUnpaid;
                })
        
        
        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Buyer-Confirmed"}).sortable(req)
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })
                res.json(orders);
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
            // res.json(result[0].totalPaid);
            res.locals.totalPaid = result[0].totalPaid;
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
                // res.json(result[0].totalUnpaid);
                res.locals.totalUnpaid = result[0].totalUnpaid;
            })

        var output = []
        Order.find({'products.sellerId' : req.signedCookies.sellerId, status : "Completed"}).sortable(req)
            .then(orders => {
                orders.forEach(function(document) {output.push(document.products) })
                res.json(orders);
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