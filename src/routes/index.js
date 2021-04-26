const meRouter = require('./me');
const newsRouter = require('./news');
const siteRouter = require('./site');
const booksRouter = require('./books');
const buyersRouter = require('./buyers');
const cartsRouter = require('./carts');
const authMiddleware = require('../middlewares/auth.middleware');
const sellersRouter = require('./sellers');
const AuthSeller = require('../middlewares/seller.auth.middleware');
const AuthCommon = require('../middlewares/auth.middleware.common');
const ordersRouter = require('./orders');


function route(app)
{
  app.use('/me', AuthSeller.requireAuthSeller, meRouter);  
  app.use('/news', AuthSeller.requireAuthSeller, newsRouter);
    app.use('/books', booksRouter);
    app.use('/buyer', buyersRouter);
    app.use('/seller', sellersRouter);
    app.use('/order', ordersRouter);
    app.use('/cart', authMiddleware.requireAuth, cartsRouter);
      app.use('/', siteRouter);
      //app.get('/news', (req, res) => {
        //res.render('news');
     // })  
      
      
      
}

module.exports = route;