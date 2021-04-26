const control = require("../app/controllers/BuyerController");
const Buyer = require("../app/controllers/models/Buyer");
const Seller = require("../app/controllers/models/Seller");

module.exports.requireAuth = function(req,res,next){

        if(!req.signedCookies.userId){
            res.redirect('/buyer/login');
            return;
        }
  

        if(!req.signedCookies.userId){
            res.redirect('/buyer/login');
            return;
        }
    
        Buyer.findOne({_id : req.signedCookies.userId})
        .then(  buyer => {
            //console.log(buyer._id)
            res.locals.buyer = buyer.toJSON();
             })
        .catch({});
    
     next();
}