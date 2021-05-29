const { rmSync } = require('fs');
const Book = require('../../app/controllers/models/Book');
const Buyer = require('../../app/controllers/models/Buyer');
const Seller = require('../../app/controllers/models/Seller');
const { setCookie } = require('../../middlewares/cookie.middleware');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

//const { mongooseToObject } = require('../../util/mongoose');

var path = require('path');
const fs = require('fs')

class SellerController {
    
        create(req,res,next)
    {
        res.render('sellers/sign-up1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    store(req,res,next)
    {
        const seller = new Seller(req.body);
        const username1 = req.body.username;
        const password = req.body.password;


        req.check('username', 'Bạn cần phải nhập địa chỉ Email').isEmail().normalizeEmail();
        req.check('password', 'Bạn cần phải nhập mât khẩu').notEmpty();
        req.check('confirmpassword', 'Bạn cần phải nhập lại mât khẩu').notEmpty();
        req.check('password', 'Độ dài mật khẩu tối thiểu là 6').isLength({
            min: 6
        });
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

         else if(req.body.confirmpassword != req.body.password)
         {
            var error = {location: 'body', param: "confirmpassword", msg: "Mật khẩu và Mật khẩu nhập lại không trùng khớp", value: req.body.confirmpassword};
           
            if (!errors)
            {
                errors = [];
            }
            errors.push(error);
           console.log(errors);
           req.session.errors = errors;
            req.session.success = false;
            res.statusCode = 400;
            return res.json({
                message : 'Password & ComfirmPasword is not same'
            })
        }

         else{

            Seller.findOne({username : username1})
            .then(user => {
                var error = {location: 'body', param: "username", msg: "Email này đã được đăng sử dụng để đăng kí", value: req.body.username};
                if(user)
                {
                    if (!errors)
                    {
                        errors = [];
                    }
                    errors.push(error);
                    console.log(errors);
                    req.session.errors = errors;
                    req.session.success = false;
                //     res.redirect('/seller/sign-up');   
                    res.statusCode = 400;
                    return res.json({
                        message : 'Email is used'
                    })
                }
                else{
                    req.session.success = true;
                    seller.save();
                    // res.redirect('/seller/sign-up');  
                    res.json({
                        message : 'Sign up successfully'
                    })
                }
                
            })
         }

        // Seller.findOne({username : username})
        //     .then(result => {
        //         if(result) {
        //             console.log('Tai khoan da ton tai');
        //             res.redirect('/seller/sign-up')
        //         }
        //         else{
        //             seller.save()
        //             .then(() => res.redirect('/'))
        //             .catch(error => {});
        //         }
        //     })
        //     . catch(err => {});

       
    }


    login(req,res,next)
    {
        
        res.render('sellers/login1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    verifyaccount(req,res,next)
    {
        var username = req.body.username;
        var password = req.body.password;

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
        
        
        Seller.findOne({username : req.body.username})
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
                if(req.body.password != result.password)
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
                    //     res.redirect('/seller/login');
                    res.statusCode = 404;
                    return res.json({
                        message : 'Password is wrong'
                    })
                }
                else {
                        res.cookie('sellerId', result._id, {
                            signed: true
                        });

                        // Promise.all([Seller.findOne({username : username}), Book.find({sellerID : username }), Book.countDocumentsDeleted()])
                        //     .then(([seller, books, deletedCount]) =>
                        //     res.render('me/stored-books', {
                        //         seller: mongooseToObject(seller),
                        //         books: mutipleMongooseToObject(books),
                        //         deletedCount,
                        //       }),
                             
                        //       )
            
                        //      .catch(next);
                        res.json({
                            message : 'Login successfully',
                            cookie : result._id
                        })
                     }   
            }
          })
          .catch(err => {});
    }


  /*   sellerinfo(req,res,next)
    {
        console.log(req.headers)
        var cookie2 = setCookie(req);

        if (cookie2){
            
            Seller.findOne({_id : cookie2})
                .then(seller => {
                    console.log(seller)
                    res.json(seller);
            
            })
        }
        else {
            res.json('');
        }
    } */

    sellerinfo(req,res,next)
    {
        var cookie2 = setCookie(req);
     
        if (cookie2){

            Seller.findOne({_id : cookie2})
                .then(seller => {
                    if(seller.avatar)
                    {
                        fs.readFile(path.resolve(".") + '/public' + seller.avatar, (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            var output = {
                                userInfo: seller,
                                imagePath: data,
                            }
                            
                            console.log(output)
                            res.status(202).json(output);
                        })
                    }
                    else{
                        var output = {
                            userInfo: seller,
                            imagePath: '',
                        }
                        
                        console.log(output)
                        res.status(202).json(output);
                    }
            
            })
            }
            else {
                res.json('');
            }
      
    }

    update(req,res,next)
    {
        console.log('1111111111111111111')
        console.log(req.body)
        var cookie3 = setCookie(req)
        console.log(cookie3)

        Seller.find({_id: cookie3 }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Seller not found'
                })
             }
        
            if (result) {
                if(req.file)
                {
                    req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
                }
                Seller.updateOne({_id: cookie3 }, req.body)
                    .then(() => res.json({
                        message : 'Update seller profile successfully'
                        }))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Seller not found'
                    })
            }
        })
    }

    logout(req,res,next)
    {
        res.clearCookie('sellerId'); 
        res.json({
            message : 'Logout Successfully'
        })
    }

}

module.exports = new SellerController();
