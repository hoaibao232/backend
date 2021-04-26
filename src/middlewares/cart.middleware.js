const control = require("../app/controllers/BuyerController");
const Buyer = require("../app/controllers/models/Buyer");
const Cart = require("../app/controllers/models/Cart");
const Seller = require("../app/controllers/models/Seller");

module.exports = function(req,res,next){
    
    if(req.signedCookies.userId){
         Cart.countDocuments({userID : req.signedCookies.userId})
           .then(count => {
            res.locals.cartCount = count;
           })
          .catch(next);
    }
    
     next();
}
