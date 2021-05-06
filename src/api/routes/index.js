const meRouter = require('./me');
// const newsRouter = require('./news');
const siteRouter = require('./site');
const booksRouter = require('./books');
const buyersRouter = require('./buyers');
// const cartsRouter = require('./carts');
// const authMiddleware = require('../middlewares/auth.middleware');
const sellersRouter = require('./sellers');
const AuthSeller = require('../../middlewares/seller.auth.middleware');
// const AuthCommon = require('../middlewares/auth.middleware.common');
// const ordersRouter = require('./orders');
// const adminRouter = require('./admin');
// const AuthAdmin = require('../middlewares/admin.auth.middleware');
// const paypalRouter = require('./paypal');

function routeAPI(app)
{
    app.use('/api/me', AuthSeller.requireAuthSeller, meRouter);  
    // app.use('/news', AuthSeller.requireAuthSeller, newsRouter);
    app.use('/api/buyers', buyersRouter);
    app.use('/api/sellers', sellersRouter);
    // app.use('/order', ordersRouter);
    // app.use('/cart', authMiddleware.requireAuth, cartsRouter);
    // app.use('/admin', adminRouter);
    // app.use('/paypal', paypalRouter);
    app.use('/api/books', booksRouter);
    app.use('/api', siteRouter)
}

module.exports = routeAPI;