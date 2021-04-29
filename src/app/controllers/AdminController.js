const Book = require('./models/Book');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Buyer = require('./models/Buyer');
const Seller = require('./models/Seller');
const Admin = require('./models/Admin');
const Order = require('./models/Order');



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
            res.redirect('/admin/login');   
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
                 res.redirect('/admin/login'); 
                return;
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
                        res.redirect('/admin/login');
                }
                else {
                        res.cookie('adminId', result._id, {
                            signed: true
                        });
                             res.redirect('/');
                     }   
            }
          })
          .catch(err => {});
    }


    adminInfo(req,res,next)
    {
        Admin.findOne({_id : req.signedCookies.adminId})
        .then(admin => {
            res.render('admin/info1', {
                admin: mongooseToObject(admin)})
        
        })
    }

    update(req,res,next)
    {
        if(req.file)
        {
            req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        }
        Admin.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/info'))
            .catch(next);
    }

    logout(req,res,next)
    {
        res.clearCookie('adminId'); 
        res.redirect('/');
    }

    storedBuyers(req,res,next) {
        Buyer.find({}).sortable(req)
            .then(buyers => {
                res.render('admin/stored-buyer', {
                    buyers : mutipleMongooseToObject(buyers)
                })
            })
    }

    showOrderBuyers(req,res,next)
    {
        Order.find({userID : req.params.id}).sortable(req)
            .then(orders => {
                res.render('admin/showBuyerOrders', {
                    orders : mutipleMongooseToObject(orders)
                })
            })
    }

    storedSellers(req,res,next) {
        Seller.find({}).sortable(req)
            .then(sellers => {
                res.render('admin/stored-seller', {
                    sellers : mutipleMongooseToObject(sellers)
                })
            })
    }

    showOrderSellers(req,res,next)
    {
        Order.find({sellerID : req.params.id}).sortable(req)
            .then(orders => {
                res.render('admin/showSellerOrders', {
                    orders : mutipleMongooseToObject(orders)
                })
            })
    }

    storedBook(req,res,next)
    {
        Book.find({}).sortable(req)
            .then(books => {
                res.render('admin/stored-book', {
                    books : mutipleMongooseToObject(books)
                })
            })
    }

    storedBookSeller(req,res,next)
    {
        Seller.find({})
            .then(sellers => {
                res.render('admin/storedBookSeller', {
                    sellers : mutipleMongooseToObject(sellers)
                })
            })
    }

    storedBookSellerManage(req,res,next)
    {
        Book.find({sellerID : req.params.id})
            .then(books => {
                res.render('admin/storedBookSellerManage', {
                    books : mutipleMongooseToObject(books)
                })
            })
    }

    storedBookInactive(req,res,next)
    {
        let bookQuery = Book.find({quantities : 0}).sortable(req);

        Promise.all([bookQuery, Book.countDocumentsDeleted()])
        .then(([books, deletedCount]) =>
            res.render('admin/storedBookInactive', {
                deletedCount,
                books: mutipleMongooseToObject(books),
            })
        )
        .catch(next);
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
            console.log(result[0].totalPaid);
            res.locals.totalPaid = result[0].totalPaid;
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
                console.log(result[0].totalUnpaid);
                res.locals.totalUnpaid = result[0].totalUnpaid;
            })


        Order.find({status : "Completed"}).sortable(req)
        .then(orders => {
            res.render('admin/payment-unpaid', {
                orders: mutipleMongooseToObject(orders),
            })
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
            console.log(result[0].totalPaid);
            res.locals.totalPaid = result[0].totalPaid;
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
                console.log(result[0].totalUnpaid);
                res.locals.totalUnpaid = result[0].totalUnpaid;
            })

        Order.find({status : "Buyer-Confirmed"}).sortable(req)
        .then(orders => {
            res.render('admin/payment-paid', {
                orders: mutipleMongooseToObject(orders),
            })
        })    
    }

    editBuyers(req,res,next)
    {
        Buyer.findOne({_id : req.params.id})
        .then(buyerr => {
            res.render('admin/buyerEditInfo', {
                buyerr: mongooseToObject(buyerr)})
        
        })
    }

    updateInfoBuyers(req,res,next)
    {
        if(req.file)
        {
            req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        }
        Buyer.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroy(req,res,next)
    {
        Buyer.deleteOne({_id: req.params.id})
        .then(() => res.redirect('back'))
        .catch(next);
    }

    editSellers(req,res,next)
    {
        Seller.findOne({_id : req.params.id})
        .then(sellerr => {
            res.render('admin/sellerEditInfo', {
                sellerr: mongooseToObject(sellerr)})
        
        })
    }

    updateInfoSellers(req,res,next)
    {
        if(req.file)
        {
            req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        }
        Seller.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroySeller(req,res,next)
    {
        Seller.deleteOne({_id: req.params.id})
        .then(() => res.redirect('back'))
        .catch(next);
    }

    editBooks(req,res,next)
    {
        Book.findById(req.params.id)
        .then(book => res.render('admin/bookEdit', {
            book: mongooseToObject(book)
        }))
        .catch(next);
    }

    updateBooks(req,res,next){
        if(!req.file)
        {
            Book.findOne({_id: req.params.id})
                .then(book => {
                    req.body.image = book.image;
                    Book.updateOne({_id: req.params.id }, req.body)
                        .then(() => res.redirect('back'))
                        .catch(next);
                })
        }
        else{
            req.body.image = "\\" + req.file.path.split('\\').slice(1).join('\\');
            Book.updateOne({_id: req.params.id }, req.body)
                .then(() => res.redirect('back'))
                .catch(next);
        }
    }

    forceDestroyBook(req,res,next)
    {
        Book.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    storedOrderAll(req,res,next)
    {
        Order.find({}).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderAll', {
                    orders : mutipleMongooseToObject(orders)
                })
            })
    }

    editOrder(req,res,next)
    {
        Order.find({_id : req.params.id})
            .then(order => {
                res.render('admin/editOrder', {
                    order : mutipleMongooseToObject(order)
                })
            })
    }

    updateOrder(req,res,next)
    { 
        Order.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('back'))
            .catch(next);
    }

    forceDestroyOrder(req,res,next)
    {
        Order.deleteOne({_id: req.params.id})
            .then(() => res.redirect('back'))
            .catch(next);
    }

    storedOrdernotApproved(req,res,next)
    {
        Order.find({status : "Not approved"}).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderNotapproved', {
                orders: mutipleMongooseToObject(orders),
                })
            })    
    }

    storedOrdertoShip(req,res,next)
    {
        Order.find({status : "Approved" }).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderToShip', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    storedOrderShipping(req,res,next)
    {
        Order.find({status : "toShip" }).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderShipping', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    storedOrderCompleted(req,res,next)
    {
        Order.find({$or : [{status : "Completed"}, {status : "Buyer-Confirmed"}] }).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderCompleted', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }

    storedOrderCanceled(req,res,next)
    {
        Order.find({status : "Canceled"}).sortable(req)
        .then(orders => {
            res.render('admin/storedOrderCanceled', {
            orders: mutipleMongooseToObject(orders),
            })
        })  
    }

    storedOrderReturn(req,res,next)
    {
        Order.find({status : "Return" }).sortable(req)
            .then(orders => {
                res.render('admin/storedOrderReturn', {
                orders: mutipleMongooseToObject(orders),
            })
        })
    }
}

module.exports = new AdminController();
