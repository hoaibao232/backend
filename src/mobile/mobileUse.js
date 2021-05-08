const { cpuUsage } = require('process');
const Book = require('../app/controllers/models/Book');
const Buyer = require('../app/controllers/models/Buyer');
const Cart = require('../app/controllers/models/Cart');
const Order = require('../app/controllers/models/Order');
var result1 = []
module.exports = function mobileUse(req,res,next)
{
    const app = require('express')();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const fs = require('fs');
    
    io.on('connection', (socket) => {
        console.log("Co nguoi connect ne");
    
        //DANG KY NGUOI MUA
        socket.on('clientSignUp', (arg) => {
            Buyer.findOne({username : arg.username})
                .then(user => {
                    var str
                    if(user)
                    {
                    str = 'Buyer is registered!';
                    console.log('Buyer is registered!')
                    }
                    else
                    {
                        console.log(arg.username)
                        const buyer = new Buyer({
                            username : arg.username,
                            password : arg.password,
                        })
                        buyer.save();
                        str = 'Buyer Signup Successfully!';
                    }
                    io.emit('buyerSignup', str);
                })
        });

        //DANG NHAP NGUOI MUA
        socket.on('clientSignIn', (arg) => {
        var username1 = arg.username;
        var password1 = arg.password;
        Buyer.findOne({username : username1})
        .then(result => {
            var str;
            if(!result) {
                str = 'Account is not exits!%%%' + result._id +'%%%'+result.username+'%%%'+result.password;
            }
            else {
                
                if(password1 != result.password)
                {
                    str = 'Password was wrong!%%%' + result._id+'%%%'+result.username+'%%%'+result.password;
                }
                else {
                    str = 'Login Successfully!%%%'+result._id+'%%%'+result.username+'%%%'+result.password;
                }
                
            }
            io.emit('buyerSignin', str);
            console.log(str);
          })
          .catch(err => {});
        });

        //HOME
        socket.on('clientHomeProducts', (arg) => {
            Book.find({})
                .then(books => {
                    io.emit('serverHomeProducts', JSON.parse(JSON.stringify(books)));
                })
              })

              //REQUEST PROFILE
              socket.on('buyerProfile', (arg) => {
                Buyer.findOne({_id : arg})
                    .then(buyer => {
                        io.emit('serverBuyerProfile', JSON.parse(JSON.stringify(buyer)));
                        
                    })
    
                  })

                  //UPDATE USER PROFILE
              socket.on('buyerUpdateProfile', (arg) => {
                
                         console.log(arg.userId);
                         Buyer.updateOne({_id : arg.userId}, {
                            buyername: arg.name,
                            address: arg.address,
                            phone: arg.phone,
                            password : arg.password,
                         })
                            .then({})
                            
                    })

                //ADD CART
              socket.on('buyerAddCart', (arg) => {
                console.log(arg);
                Book.findOne({slug : arg.slug})
                .then (book => {
                    Cart.find({productslug : book.slug}, function(err, doc) {
                        if (err) { return console.error(err); }
                        else if (doc)
                        {
                            //sp da ton tai trong gio hang, trung userid cookie thi moi them duoc
                            
                            Cart.find({productslug : book.slug})
                                .then(cart => {
                                   
                                    var quantityy = cart.quantity
                                    var output = []
                                    
                                    cart.forEach(function(document) {output.push(document.userID) }),
                                    Cart.updateOne({productslug : book.slug, userID : arg.userId}, { $inc: {quantity : arg.quantity} }, function(err, doc) {
                                        if (err) return console.error(err);
                                        console.log("Buyer on Mobile Add Product to Cart Successfully");
                                      });
                                })
                                .catch(next);
                                
                                //neu ton tai nhung chua co userID
                                Book.findOne({slug : arg.slug})
                                .then (book => {
                                    Cart.find({productslug : book.slug}, function(err, doc) {
                                        if (err) { return console.error(err); }
                                        else if (doc)
                                        {
                                            var output = []
                                           doc.forEach(function(document) {output.push(document.userID)})
                                            if(output.indexOf(arg.userId) <= -1)
                                            {
                                                var cart = new Cart();
                                                cart.productname = book.name;
                                                cart.productID = book._id;
                                                cart.productimage= book.image;
                                                cart.price = book.price;
                                                cart.userID = arg.userId;
                                                cart.sellerID = book.sellerID;
                                                cart.sellerName = book.shopname;
                                                cart.productslug = book.slug;
                                                cart.quantity = arg.quantity;
                                                cart.totalprice = parseFloat((arg.quantity * book.price).toFixed(2));
                                                cart.save(function(err, doc) 
                                                {
                                                if (err) return console.error(err);
                                                console.log("Buyer on Mobile Add Product to Cart Successfully");
                                                })
    
                                            }
                                        }
                                    }
                                
                                    )
                                })
                                
                                    
                                
                        }
    
                        else {
                            var cart = new Cart();
                            cart.productname = book.name;
                            cart.productID = book._id;
                            cart.productimage= book.image;
                            cart.price = book.price;
                            cart.userID = arg.userId;
                            cart.sellerID = book.sellerID;
                            cart.sellerName = book.shopname;
                            cart.productslug = book.slug;
                            cart.quantity = arg.quantity;
                            cart.totalprice = parseFloat((cart.quantity * book.price).toFixed(2));
                            cart.save(function(err, doc) 
                            {
                             if (err) return console.error(err);
                             console.log("Document inserted succussfully!");
                            })
                        }
    
                    })
    
                    Cart.findOne({productslug : book.slug, userID : arg.userId})
                        .then(cart => {
                            console.log(cart.productslug);
                            var totalpricee = parseFloat((cart.price * (cart.quantity + 1 )).toFixed(2));
                            Cart.updateOne({productslug : book.slug, userID : arg.userId}, { $set: {totalprice : totalpricee} }, function(err, doc) {
                                if (err) return console.error(err);
                                console.log("Document inserted successfully!!!!!!");
                              });
                        })
                        .catch({})
            })
                  })


                //SHOW BUYER CART
                socket.on('buyerShowCart', (arg) => {
                    // console.log(arg);
                    Book.find({deleted: {$ne: true}})
                        .then(books => {
                            var output = []
                            books.forEach(function(document) {output.push(document.slug) }),
                            Cart.find({productslug : output, userID : arg})
                                .then(carts => 
                                {
                                    io.emit('serverBuyerShowCart', JSON.parse(JSON.stringify(carts)));
                                    
                                })
                                .catch(next);
                            })
                        .catch(next);                      
               })

               //CART TO ORDER
               socket.on('cartToOrders', (arg) => {
                   arg.forEach(function (element) {
                       Cart.findOne({ userId: arg[0].userId, _id: element._id })
                           .then(cart => {
                               Cart.updateOne({ _id: element._id }, { $set: { quantity: element.quantity } }, function (err, doc) {
                                   if (err) return console.error(err);

                               });
                           })
                   })


                var cartIds = [];
                arg.forEach(function(document) 
                {
                    cartIds.push(document._id);
                            
                })
                Cart.find({_id: { $in : cartIds }})
                .then(carts => {
                    var output1 = [];
                    carts.forEach(function(document) 
                    {
                    output1.push(document.productID);
                                
                    })
                    
                    var i = 0;
                    var k = 0;
                    
                            output1.forEach(function(document)
                        {
                            
                            Book.findOne({_id : document})
                                .then(book => {
                                    if(k < carts.length)
                                    {
                                        var newquantity = book.quantities - carts[k].quantity;
                                        Book.updateOne({_id : document},  { $set: {quantities : newquantity} }, function(err, doc) {
                                        if (err) return console.error(err);
                                        })    
                                        k++;
                                    }
                                    
                                })
                        })

                        Cart.aggregate([
                            { $group: { 
                                _id: "$sellerID",
                                count: { $sum:  1 },
                                docs: { $push: "$_id"}
                            }},
                            { $match: {
                                count: { $gt : 0 },
                                // _id: { $in : req.body.cartIds }
                            }}
                        ])
                        .then(result => {
                            // console.log(result)
                            result.forEach(function(group) {
                            var kk = [];
                            var total = 0;
                            var sellername;
                            Cart.find({ $and : [ {_id: { $in : group.docs }}, {_id: { $in : cartIds }}]   })
                                .then(carts => {
                                    // console.log(carts);
                                    carts.forEach(function(document) {
                                        console.log(document._id);
                                        var output = 
                                    {
                                        quantity: document.quantity,
                                        tittle: document.productname,
                                        unit_cost: document.price,
                                        total_cost: document.totalprice,
                                        sellerId: document.sellerID,
                                        bookId : document.productID,
                                        cartId : document._id,
                                        
                                    }
                                        console.log(document._id);
                                        kk.push(output);
                                        total = total + document.totalprice;
                                        sellername = document.sellerName;
                                    })
    
                                    if(kk.length != 0)
                                    {
                                        var order1 = new Order(
                                            {
                                                name : arg[0].name,
                                                address : arg[0].address,
                                                addresspm : arg[0].addresspm,
                                                phone : arg[0].phone,
                                                userID : arg[0].userID,
                                                products : kk,
                                                sellerID : group._id,
                                                payment : total,
                                                sellerName : sellername,
                                            }
                                        );
                                        order1.save();
                                        
                                    }
                                })
                            })
                            Cart.deleteMany({_id: { $in : cartIds }})
                                    .then({})
            
                        })
                })

           })

                //BUY NOW
                socket.on('BuyNow', (arg) => {
                    var str;
                    console.log(arg);
                   
                Book.findOne({_id : arg._id})
                .then(book => {
                if((arg.quantity > book.quantities) || ( book.quantities <= 0))
                    {
                            str = "Order quantity is bigger than book's quantity left";
                    }
                else{

                            var output = 
                            {
                                quantity: arg.quantity,
                                tittle: book.name,
                                unit_cost: book.price,
                                total_cost: parseFloat((book.price * arg.quantity).toFixed(2)),
                                sellerId: book.sellerID,
                                bookId : arg._id,
                                cartId: "",
                                sellerName: arg.sellerName,
                            }
                       
                            userID = arg.userId;
                            products = output;
                            const order = new Order({
                                name: arg.name,
                                address: arg.address,
                                addresspm: arg.addresspm,
                                phone: arg.phone,
                                userID: arg.userId,
                                payment: parseFloat((arg.price * arg.quantity).toFixed(2)),
                                products : output,
                                sellerName: arg.sellerName,
                            });
                            order.save();     
                                var newquantity = book.quantities - arg.quantity;
                                Book.updateOne({_id : arg._id},  { $set: {quantities : newquantity} }, function(err, doc) {
                                    if (err) return console.error(err);
                                    
                                });                        
                         }        

            })
                    
                })

                    //DELETE CART
                socket.on('deleteCartItem', (arg) => {
                    Cart.deleteOne({ userID: arg.userId, productID: arg.productID }, function (err, doc) {
                        if (err) return console.error(err);

                    });  
                });

                //DELETE ORDER
        socket.on('deleteOrder', (arg) => {
            console.log(arg)
                    Order.deleteOne({ userID: arg.userId, _id: arg.orderId }, function (err, doc) {
                        if (err) return console.error(err);

                    });
                });


            //BUYER ORDER All
            socket.on('buyerOrderAll', (arg) => {
                
                Order.find({userID : arg})
                    .then(orders => {
                        var output1 = [];
                        orders.forEach(function(document) 
                        {
                            output1.push(document);         
                        })
                        io.emit('serverOrderAll', JSON.parse(JSON.stringify(output1)))
                        console.log(output1);
                    })
           })


    });

    server.listen(3003);
}