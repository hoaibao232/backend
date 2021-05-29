const meRouter = require('./me');
// const newsRouter = require('./news');
const siteRouter = require('./site');
const booksRouter = require('./books');
const buyersRouter = require('./buyers');
const cartsRouter = require('./carts');
const authMiddleware = require('../../middlewares/auth.middleware');
const sellersRouter = require('./sellers');
const AuthSeller = require('../../middlewares/seller.auth.middleware');
// const AuthCommon = require('../middlewares/auth.middleware.common');
const ordersRouter = require('./orders');
const adminRouter = require('./admin');
// const AuthAdmin = require('../middlewares/admin.auth.middleware');
const paypalRouter = require('./paypal');
const  CookieRequire  = require('../../middlewares/cookie.middleware');


function routeAPI(app)
{
    app.use('/api/me', meRouter);  //seller manage books, orders, payment
    app.use('/api/buyers', buyersRouter); //login, logout, signup, info, update info
    app.use('/api/sellers', sellersRouter); //login, logout, signup, info, update info
    app.use('/api/orders', ordersRouter); //buyer manage orders
    app.use('/api/carts' ,cartsRouter); //buyer add, show, update, delete cart
    app.use('/api/admin', adminRouter); //admin manage books, sellers, buyers, orders, payment
    app.use('/api/paypal', paypalRouter); //cancel paypal payment
    app.use('/api/books', booksRouter); //xem, thêm, sửa, xóa sách
    app.use('/api', siteRouter) //home, search
}

module.exports = routeAPI;