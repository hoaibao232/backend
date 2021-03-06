const Book = require('../../app/controllers/models/Book');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Buyer = require('../../app/controllers/models/Buyer');

const bodyParser = require('body-parser');
const { setCookie } = require('../../middlewares/cookie.middleware');
var path = require('path');
const fs = require('fs')
class BuyerController {
    
    create(req,res,next)
    {
        res.render('buyers/sign-up1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    store(req,res,next)
    {
        console.log(req.body.data)
        const buyer = new Buyer(req.body.data);
        const username1 = req.body.data.username;
        const password = req.body.data.password;
        //const value = req.body.username;
       
        /* req.check('username', 'Bạn cần phải nhập địa chỉ Email').isEmail().normalizeEmail();
        req.check('password', 'Bạn cần phải nhập mât khẩu').notEmpty();
        req.check('confirmpassword', 'Bạn cần phải nhập lại mât khẩu').notEmpty();
        req.check('password', 'Độ dài mật khẩu tối thiểu là 6').isLength({
            min: 6
        }); */
        var errors = req.validationErrors();
        if(errors){
            console.log(errors);
            req.session.errors = errors;
            req.session.success = false;
            // res.redirect('/buyer/sign-up'); 
            res.statusCode = 400;
            return res.json({
                message : errors,
            })    
         }

         else if(req.body.data.confirmpassword != req.body.data.password)
         {
            var error = {location: 'body', param: "confirmpassword", msg: "Mật khẩu và Mật khẩu nhập lại không trùng khớp", value: req.body.data.confirmpassword};
           
            if (!errors)
            {
                errors = [];
            }
            errors.push(error);
           console.log(errors);
           req.session.errors = errors;
            req.session.success = false;
            // res.redirect('/buyer/sign-up');
            res.statusCode = 400;
            return res.json({
                message : 'Password & ComfirmPasword is not same'
            })
         
        }

         else{
        Buyer.findOne({username : username1})
            .then(user => {    
                var error = {location: 'body', param: "username", msg: "Email này đã được đăng kí", value: req.body.data.username};
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
                // res.redirect('/buyer/sign-up');   
                    res.statusCode = 404;
                    /* res.statusText = "error"; */
                    return res.json(
                        {
                            message : 'Email is used'

                        }

                    )
                }
                else{
                    req.session.success = true;
                    buyer.save();
                    // res.redirect('/buyer/sign-up');  
                    res.json({
                        message : 'Sign up successfully'
                    })    
                }
                
            })
        }
          

        // Buyer.findOne({username : username})
        //     .then(result => {
        //         if(result) {
        //             console.log('Tai khoan da ton tai');
        //             res.redirect('/buyer/sign-up')
        //         }
        //         else{
        //             buyer.save()
        //             .then(() => res.redirect('/'))
        //             .catch(error => {});
        //         }
        //     })
        //     . catch(err => {});

       
    }


    login(req,res,next)
    {
        
        res.render('buyers/login1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    verifyaccount(req,res,next)
    {
         // Website you wish to allow to connect
        // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4040');

        // // Request methods you wish to allow
        // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // // Request headers you wish to allow
        // res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

        // // Set to true if you need the website to include cookies in the requests sent
        // // to the API (e.g. in case you use sessions)
        // res.setHeader('Access-Control-Allow-Credentials', true);

        console.log(req.headers)
        var username = req.body.username;
        var password = req.body.password;
        const buyer = new Buyer(req.body);
        
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

      
        Buyer.findOne({username : username})
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
                // res.redirect('/buyer/login');   
                // return;
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
                        // res.redirect('/buyer/login');  
                        res.statusCode = 404;
                        return res.json({
                            message : 'Password is wrong'
                        })

                }
                else {
                    res.status(202)
                    .cookie('userId', result._id, {
                        maxAge: 60 * 60 * 1000, // 1 hour
                        httpOnly: true,
                        /* secure: true,
                        sameSite: true, */
                        signed: true
                    })
                    .json({message : 'cookies being initialsied',
                            cookie : result._id

                        });

                       /*  res.locals.cookies = result._id;
 */

                            //   res.redirect('/')
                            // res.json({
                            //     message : 'Login successfully',
                            //     userId : result._id,
                            // })
                   /*  res.setHeader('set-Cookies', result._id); */
                }
            }
          })
          .catch(err => {});
    }


    buyerinfo(req,res,next)
    {
        var cookie2 = setCookie(req);
        console.log(path.resolve("."))
        if (cookie2){

            Buyer.findOne({_id : cookie2})
                .then(buyer => {
                    if(buyer.avatar)
                    {
                        fs.readFile(path.resolve(".") + '/public' + buyer.avatar, (err, data) => {
                            if (err) {
                                console.error(err)
                                return
                            }
                            var output = {
                                userInfo: buyer,
                                imagePath: data,
                            }
                            
                            console.log(output)
                            res.status(202).json(output);
                        })
                    }
                    else{
                        var output = {
                            userInfo: buyer,
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
        console.log(req.body)
        var cookie3 = setCookie(req)
        //req.param : _id
        Buyer.find({_id: cookie3 }, function(err, result) {
            if (err) { 
                res.statusCode = 500;
                return res.json({
                    message : 'Buyer not found'
                })
             }
        
            if (result) {
                if(req.file)
                {
                    req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
                }
                Buyer.updateOne({_id: cookie3 }, req.body)
                    .then(() => res.json({
                        message : 'Update buyer profile successfully'
                        }))
                    .catch(next);
            } else {
                    res.statusCode = 500;
                    return res.json({
                        message : 'Buyer not found'
                    })
            }
        }).limit(1)
    }
        

    logout(req,res,next)
    {
        res.clearCookie('userId'); 
        res.json({ message : 'Logout Successfully'})
    }

}

module.exports = new BuyerController();
