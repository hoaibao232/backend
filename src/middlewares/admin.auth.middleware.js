const control = require("../app/controllers/BuyerController");
const Admin = require("../app/controllers/models/Admin");
const Buyer = require("../app/controllers/models/Buyer");
const Seller = require("../app/controllers/models/Seller");

module.exports.requireAuthAdmin = function(req,res,next){
    if(!req.signedCookies.adminId){
        res.redirect('/admin/login');
        return;
    }

    if(!Admin.findOne({_id : req.signedCookies.adminId}))
    {
        res.redirect('/admin/login');
        return;
    }

    Admin.findOne({_id : req.signedCookies.adminId})
        .then(   admin=> {
            res.locals.admin = admin.toJSON();
             })
        .catch({})
 
     next();
}
