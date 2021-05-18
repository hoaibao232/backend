const control = require("../app/controllers/BuyerController");
const Buyer = require("../app/controllers/models/Buyer");
const Cart = require("../app/controllers/models/Cart");
const Seller = require("../app/controllers/models/Seller");

module.exports = {
    setCookie : function (req){
        var cookie2 = req.headers.cookie;
        var cookie = '';
            
        if (cookie2){
            const values = cookie2.split(';').reduce((res, item) => {
                const data = item.trim().split('=');
                return { ...res, [data[0]]: data[1] };
            }, {})
            cookie =values.userId;
        }

        return cookie;
    }
}