const control = require("../app/controllers/BuyerController");
const shorid = require('shortid');
const Buyer = require("../app/controllers/models/Buyer");
const shortid = require("shortid");
const Session = require("../app/controllers/models/Session");

module.exports = function(req,res,next){
    if (!req.signedCookies.sessionId) {
        var sessionId = shortid.generate()
        res.cookie('sessionId', sessionId, {
            signed: true
        })

        var session = new Session();
        session.idd = sessionId;
        session.save(function(err, doc) {
            if (err) return console.error(err);
            //console.log("Document inserted succussfully!");
          });
    }
    
    next();
}