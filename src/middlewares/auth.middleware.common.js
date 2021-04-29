const control = require("../app/controllers/BuyerController");
const Admin = require("../app/controllers/models/Admin");
const Buyer = require("../app/controllers/models/Buyer");
const Seller = require("../app/controllers/models/Seller");

module.exports.requireAuth = function(req,res,next){
    if(req.signedCookies.userId){
        Buyer.findOne({_id : req.signedCookies.userId})
        .then(  buyer => {
            //console.log(buyer._id)
            res.locals.buyer = buyer.toJSON();
             })
        .catch({});
    }

    else if(req.signedCookies.sellerId)
    {
        Seller.findOne({_id : req.signedCookies.sellerId})
        .then(seller=> {
            //console.log(seller._id)
            res.locals.seller = seller.toJSON();
             })
        .catch({});
    }
    else if(req.signedCookies.adminId)
    {
        Admin.findOne({_id : req.signedCookies.adminId})
        .then(admin=> {
            //console.log(seller._id)
            res.locals.admin = admin.toJSON();
             })
        .catch({});
    }
    
     next();
}