const Book = require('./models/Book');
const  { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
//const { mongooseToObject } = require('../../util/mongoose');
const Buyer = require('./models/Buyer');
const bodyParser = require('body-parser');

class BuyerController {
    
    create(req,res,next)
    {
        res.render('buyers/sign-up1', {success:  req.session.success, errors: req.session.errors});
        req.session.errors = null;
        req.session.success = null;
    }

    store(req,res,next)
    {
        const buyer = new Buyer(req.body);
        const username1 = req.body.username;
        const password = req.body.password;
        //const value = req.body.username;
       
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
            res.redirect('/buyer/sign-up');   
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
            res.redirect('/buyer/sign-up');
         
        }

         else{
        Buyer.findOne({username : username1})
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
                res.redirect('/buyer/sign-up');   
                }
                else{
                    req.session.success = true;
                    buyer.save();
                    res.redirect('/buyer/sign-up');   
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
            res.redirect('/buyer/login');   
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
                res.redirect('/buyer/login');   
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
                        res.redirect('/buyer/login');  

                }
                else {
                    res.cookie('userId', result._id, {
                        signed: true
                    });
                              res.redirect('/')
                }
                
            }
          })
          .catch(err => {});
    }

    buyerinfo(req,res,next)
    {
       Buyer.findOne({_id : req.signedCookies.userId})
        .then(buyer => {
            res.render('buyers/info', {
                buyer: mongooseToObject(buyer)})
        
        })
    }

    update(req,res,next)
    {
        req.body.avatar = "\\" + req.file.path.split('\\').slice(1).join('\\');
        Buyer.updateOne({_id: req.params.id }, req.body)
            .then(() => res.redirect('/buyer/info'))
            .catch(next);
    }
        

    logout(req,res,next)
    {
        res.clearCookie('userId'); 
        res.redirect('/');
    }

}

module.exports = new BuyerController();
