const control = require("../app/controllers/BuyerController");
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
    
     next();
}