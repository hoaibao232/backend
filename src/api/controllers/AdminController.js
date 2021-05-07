const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const Cart = require('../../app/controllers/models/Cart');
const Order = require('../../app/controllers/models/Order');
const Admin = require('../../app/controllers/models/Admin');

class AdminController {

    login(req,res,next)
    {
        
        res.render('admin/login1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    verifyaccount(req,res,next)
    {
        var username = req.body.username;
        var password = req.body.password;
        const admin = new Admin(req.body);

        req.check('username', 'Name is required').isEmail().normalizeEmail();
        req.check('password', 'Password is required').notEmpty();
        var errors = req.validationErrors();
        if(errors){
            console.log(errors);
            req.session.errors = errors;
            req.session.success = false;
            res.statusCode = 400;
            return res.json({
                message : errors,
            })      
         }
        
        
        Admin.findOne({username : username})
        .then(result => {
            if(!result) {
                var error = {location: 'body', param: "username", msg: "Tài khoản không tồn tại", value: req.body.username};
                if (!errors)
                {
                    errors = [];
                }
                errors.push(error);
                console.log(errors);
                req.session.errors = errors;
                 req.session.success = false;
                 res.statusCode = 404;
                 return res.json({
                    message : 'Account is not exits'
                })
            }
            else {
                if(password != result.password)
                {
                    var error = {location: 'body', param: "password", msg: "Mật khẩu không chính xác", value: req.body.password};
                        if (!errors)
                        {
                            errors = [];
                        }
                        errors.push(error);
                       console.log(errors);
                       req.session.errors = errors;
                        req.session.success = false;
                        res.statusCode = 404;
                        return res.json({
                        message : 'Password is wrong'
                    })
                }
                else {
                        res.cookie('adminId', result._id, {
                            signed: true
                        });
                        res.json({
                            message : 'Login successfully'
                        })
                     }   
            }
          })
          .catch(err => {});
    }


    adminInfo(req,res,next)
    {
        Admin.findOne({_id : req.signedCookies.adminId})
        .then(admin => {
            res.json(admin);
        })
    }

    update(req,res,next)
    {
        Admin.find({_id: req.params.id }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Admin not found'
                })
             }
        
            if (result) {
                if(req.file)
                {
                    req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
                }
                Admin.updateOne({_id: req.params.id }, req.body)
                    .then(() => res.json({
                        message : 'Update admin profile successfully'
                        }))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Admin not found'
                    })
            }
        })
    }

    logout(req,res,next)
    {
        res.clearCookie('adminId'); 
        res.json({
            message : 'Logout Successfully'
        })
    }

    storedBuyers(req,res,next) {
        Buyer.find({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Buyer.find({}).sortable(req)
                    .then(buyers => {
                        res.json(buyers);
                    })
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Buyers not found'
                    })
                 }   
            }
        })
    }

    showOrderBuyers(req,res,next)
    {
        Order.find({userID : req.params.id}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Order.find({userID : req.params.id}).sortable(req)
                    .then(orders => {
                        res.json(orders);
                    })
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
                 }   
            }
        })
    }

    storedSellers(req,res,next) {
        Seller.find({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Seller.find({}).sortable(req)
                    .then(sellers => {
                        res.json(sellers);
                    })
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Sellers not found'
                    })
                 }   
            }
        })
    }

    showOrderSellers(req,res,next)
    {
        Order.find({sellerID : req.params.id}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Order.find({sellerID : req.params.id}).sortable(req)
                    .then(orders => {
                        res.locals.seller = req.params.id;
                        res.json(orders)
                    })
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Orders not found'
                    })
                 }   
            }
        })

    }

    storedBook(req,res,next)
    {
        Book.find({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Book.find({}).sortable(req)
                    .then(books => {
                        res.json(books);
                    })
  
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

    storedBookSeller(req,res,next)
    {
        Seller.find({}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                
                Seller.find({}).sortable(req)
                .then(sellers => {
                    res.json(sellers);
                })
  
            } else {
                if (err) { 
                    res.statusCode = 404;
                    return res.json({
                        message : 'Sellers not found'
                    })
                 }   
            }
        })
    }

    storedBookSellerManage(req,res,next)
    {
        Book.find({sellerID : req.params.id}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                Book.find({sellerID : req.params.id})
                    .then(books => {
                        res.json(books);
                    })
  
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

    storedBookInactive(req,res,next)
    {
        Book.find({quantities : 0}, function(err,result) {
            if (err) { 
                res.statusCode = 404;
                return res.json({
                    message : err
                })
             }
             if (result) {
                let bookQuery = Book.find({quantities : 0}).sortable(req);
                Promise.all([bookQuery, Book.countDocumentsDeleted()])
                    .then(([books, deletedCount]) =>
                        res.json(books))
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

    paymentUnpaid(req,res,next)
    {
        Order.aggregate([
            {$match : {status : "Buyer-Confirmed"}  },
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$status",
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
        // {status : {$ne : "Completed"}}

        Order.aggregate([
            {$match : {status : "Completed"}},
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$status",
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


        Order.find({status : "Completed"}).sortable(req)
        .then(orders => {
            res.json({
                order : orders,
                totalPaid : res.locals.totalPaid,
                totalUnpaid : res.locals.totalUnpaid,
            });
        })    
    }

    paymentPaid(req,res,next)
    {
        Order.aggregate([
            {$match : {status : "Buyer-Confirmed"}  },
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$status",
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
        // {status : {$ne : "Completed"}}

        Order.aggregate([
            {$match : {status : "Completed"}},
            {
                $unwind: "$products"
            },
            {$group : 
            {
                _id: "$status",
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

        Order.find({status : "Buyer-Confirmed"}).sortable(req)
        .then(orders => {
            res.json({
                order : orders,
                totalPaid : res.locals.totalPaid,
                totalUnpaid : res.locals.totalUnpaid,
            });
        })    
    }

    editBuyers(req,res,next)
    {
        Buyer.findOne({_id : req.params.id})
            .then(buyerr => {
                res.json(buyerr);
        
        })
    }

    updateInfoBuyers(req,res,next)
    {
        if(req.file)
        {
            req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        }
        Buyer.updateOne({_id: req.params.id }, req.body)
            .then(() => res.json('Update buyer profile successfully'))
            .catch(next);
    }

    forceDestroy(req,res,next)
    {
        Buyer.deleteOne({_id: req.params.id})
            .then(() => res.json('Delete buyer account successfully'))
            .catch(next);
    }

    editSellers(req,res,next)
    {
        Seller.findOne({_id : req.params.id})
        .then(sellerr => {
            res.json(sellerr);
        
        })
    }

    updateInfoSellers(req,res,next)
    {
        if(req.file)
        {
            req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        }
        Seller.updateOne({_id: req.params.id }, req.body)
            .then(() => res.json('Update seller profile successfully'))
            .catch(next);
    }

    forceDestroySeller(req,res,next)
    {
        Seller.deleteOne({_id: req.params.id})
            .then(() => res.json('Delete seller successfully'))
            .catch(next);
    }

    editBooks(req,res,next)
    {
        Book.findById(req.params.id)
            .then(book => 
                res.json(book))
            .catch(next);
    }

    updateBooks(req,res,next){
        if(!req.file)
        {
            Book.findOne({_id: req.params.id})
                .then(book => {
                    req.body.image = book.image;
                    Book.updateOne({_id: req.params.id }, req.body)
                        .then(() => res.json('Update book successfully'))
                        .catch(next);
                })
        }
        else{
            req.body.image = "\\" + req.file.path.split('\\').slice(1).join('\\');
            Book.updateOne({_id: req.params.id }, req.body)
                .then(() => res.json('Update book successfully'))
                .catch(next);
        }
    }

    forceDestroyBook(req,res,next)
    {
        Book.findOne({_id: req.params.id})
        .then((books) => {
                Seller.updateOne({_id: books.sellerID}, { $inc : {productsCount : -1} }, function(err, doc) {
                  if (err) return console.error(err);
                   });
        })

        Book.deleteOne({_id: req.params.id})
            .then(() => res.json('Delete book successfully'))
            .catch(next);
    }

    storedOrderAll(req,res,next)
    {
        Order.find({}).sortable(req)
            .then(orders => {
                res.json(orders)
            })
    }

    editOrder(req,res,next)
    {
        Order.find({_id : req.params.id})
            .then(order => {
                res.json(order)
            })
    }

    updateOrder(req,res,next)
    { 
        Order.updateOne({_id: req.params.id }, req.body)
            .then(() => res.json('Update order successfully'))
            .catch(next);
    }

    forceDestroyOrder(req,res,next)
    {
        Order.deleteOne({_id: req.params.id})
            .then(() => res.json('Delete order successfully'))
            .catch(next);
    }

    storedOrdernotApproved(req,res,next)
    {
        Order.find({status : "Not approved"}).sortable(req)
            .then(orders => {
                res.json(orders)
            })    
    }

    storedOrdertoShip(req,res,next)
    {
        Order.find({status : "Approved" }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    storedOrderShipping(req,res,next)
    {
        Order.find({status : "toShip" }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    storedOrderCompleted(req,res,next)
    {
        Order.find({$or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    storedOrderCanceled(req,res,next)
    {
        Order.find({status : "Canceled"}).sortable(req)
        .then(orders => {
            res.json(orders)
        })  
    }

    storedOrderReturn(req,res,next)
    {
        Order.find({status : "Return" }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    storedOrderDetail(req,res,next)
    {
        Order.find({_id : req.params.id }).sortable(req)
            .then(orders => {
                res.json(orders)
        })
    }

    forceDestroyOrderNow(req,res,next){
        Order.deleteOne({_id: req.params.id})
            .then(() => res.json('Force delete order now successfully'))
            .catch(next);
    }
}

module.exports = new AdminController();
