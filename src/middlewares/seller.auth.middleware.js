const control = require("../app/controllers/BuyerController");
const Buyer = require("../app/controllers/models/Buyer");
const Seller = require("../app/controllers/models/Seller");

module.exports.requireAuthSeller = function(req,res,next){
    if(!req.signedCookies.sellerId){
        res.redirect('/seller/login');
        return;
    }

    if(!Seller.findOne({_id : req.signedCookies.sellerId}))
    {
        res.redirect('/seller/login');
        return;
    }

    Seller.findOne({_id : req.signedCookies.sellerId})
        .then(   seller=> {
            res.locals.seller = seller.toJSON();
             })
        .catch({})
 
     next();
}