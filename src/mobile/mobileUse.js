const { cpuUsage } = require('process');
const Book = require('../app/controllers/models/Book');
const Buyer = require('../app/controllers/models/Buyer');
const Cart = require('../app/controllers/models/Cart');
const Order = require('../app/controllers/models/Order');

module.exports = function mobileUse(req,res,next)
{
    const app = require('express')();
    const server = require('http').createServer(app);
    const io = require('socket.io')(server);
    const fs = require('fs');
    
    io.on('connection', (socket) => {
        console.log("Co nguoi connect ne");
        
            //MOBILE SENT TO WEB
        // socket.on('clientSendItems', (arg) => {
        //     fs.readFile('items.json', (err, data) => {
        //        if (err) throw err;
        //        let items = JSON.parse(data);
        //        io.emit('serverSendItems', items);
        //     });
        // });

        //MOBILE SIGN-UP
        // socket.on('clientSignUp', (arg) => {
        //     fs.readFile('items.json', (err, data) => {
        //        if (err) throw err;
        //        let items = JSON.parse(data);
        //        io.emit('serverSendItems', items);
        //     });
        // });


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
                    console.log(JSON.parse(JSON.stringify(books)))
                    // console.log(arg);
                    
                })

              })
            
              //REQUEST PROFILE
              socket.on('buyerProfile', (arg) => {
                Buyer.findOne({_id : arg})
                    .then(buyer => {
                        io.emit('serverBuyerProfile', JSON.parse(JSON.stringify(buyer)));
                        console.log(JSON.parse(JSON.stringify(buyer)))
                        // console.log(arg);
                    })
    
                  })

                  //UPDATE USER PROFILE
              socket.on('buyerUpdateProfile', (arg) => {
                
                         console.log(arg.userId);
                         Buyer.updateOne({_id : arg.userId}, {
                            buyername: arg.name,
                            address: arg.address,
                            phone: arg.phone,
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
                                    //console.log(output),
    
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
                                        //    console.log(output)
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
                                                cart.totalprice = arg.quantity * book.price;
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
                            cart.totalprice = cart.quantity * book.price;
                            cart.save(function(err, doc) 
                            {
                             if (err) return console.error(err);
                             console.log("Document inserted succussfully!");
                            })
                            //console.log(cart);
                        }
    
                    })

                    // console.log(arg.slug);

                    // console.log(arg.userId);
                    
    
                    Cart.findOne({productslug : book.slug, userID : arg.userId})
                        .then(cart => {
                            console.log(cart.productslug);
                            var totalpricee = cart.price * (cart.quantity + 1 );
                            // console.log(totalpricee);
                            Cart.updateOne({productslug : book.slug, userID : arg.userId}, { $set: {totalprice : totalpricee} }, function(err, doc) {
                                if (err) return console.error(err);
                                console.log("Document inserted succussfully!!!!!!");
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
                                    // console.log(carts);
                                    
                                })
                                .catch(next);
                            })
                        .catch(next);                      
               })

               //CART TO ORDER
               socket.on('cartToOrders', (arg) => {
                console.log(arg);
                var cartIds = [];
                arg.forEach(function(document) 
                {
                    cartIds.push(document._id);
                            
                })
                console.log(cartIds);

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

                        var books = [];
                        Cart.find({_id: { $in : cartIds }})
                            .then(carts => {
                                carts.forEach(function(document) 
                                {
                                var output = 
                                        {
                                            quantity: document.quantity,
                                            tittle: document.productname,
                                            unit_cost: document.price,
                                            total_cost: document.totalprice,
                                            sellerId: document.sellerID,
                                            bookId : document.productID,
                                            cartId : document._id,
                                            sellerName : document.sellerName,
                                        }
                                    
                                    //console.log(output)
                                    //books.push(output)    
                                
                                    // req.body.userID = req.signedCookies.userId;
                                    // req.body.products = output;
                                    const order = new Order({
                                        userID : arg[0].userID,
                                        products : output,

                                    });
                                    order.save();   
                                    
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
                // req.body.sellerID = book.sellerID;
                // req.body.productID = req.body.bookid;

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
                                total_cost: book.price * arg.quantity,
                                sellerId: book.sellerID,
                                bookId : arg._id,
                                cartId : "",
                                sellerName : book.shopname,
                            }
                       
                            userID = arg.userId;
                            products = output;
                            const order = new Order({
                                // name : req.body.name,
                                // address : req.body.address,
                                // addresspm : req.body.addresspm,
                                // phone : req.body.phone,
                                userID : userID,
                                products : output,

                            });
                            order.save();     


                                var newquantity = book.quantities - arg.quantity;
                                Book.updateOne({_id : arg._id},  { $set: {quantities : newquantity} }, function(err, doc) {
                                    if (err) return console.error(err);
                                    
                                });                        
                         }        

            })
                    
            })

            //BUYER ORDER All
            socket.on('buyerOrderAll', (arg) => {
                
                Order.find({userID : arg})
                    .then(orders => {
                        // var sent = [
                        //     userID,
                        //     status,
                        //     products,
                        // ];

                        var output1 = [];
                        orders.forEach(function(document) 
                        {
                            var sent = [
                                document.userID,
                                // document.status,
                                // document.products,
                            ];

                        output1.push(sent);         
                        })
                        io.emit('serverOrderAllID', JSON.parse(JSON.stringify(output1)))

                        var output2 = [];
                        orders.forEach(function(document) 
                        {
                            var sent = [
                                document.status,
                            ];

                        output2.push(sent);         
                        })
                        io.emit('serverOrderAllStatus', JSON.parse(JSON.stringify(output2)))

                        var output3 = [];
                        orders.forEach(function(document) 
                        {
                            var sent = [
                                
                                document.products,
                            ];

                        output3.push(sent);         
                        })
                        io.emit('serverOrderAllProducts', JSON.parse(JSON.stringify(output3)))



                       
                        // io.emit('serverOrderAll', JSON.parse(JSON.stringify(output1)))
                        // console.log(JSON.parse(JSON.stringify(output1)))
                        
                        // orders.forEach(function(document) {

                        //     io.emit('severOrderAllID', JSON.parse(JSON.stringify(document._id)))
                        //     io.emit('severOrderAllStatus', JSON.parse(JSON.stringify(document.status)))
                        //     io.emit('severOrderAllProducts', JSON.parse(JSON.stringify(document.products)))
                        //     // console.log(document.products)
                        // })
                       
                       
                    })
           })


    });

    server.listen(3003);
}