const express = require('express');
const CartController = require('../app/controllers/CartController');
const orderController = require('../app/controllers/OrderController');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');

const AuthSeller = require('../middlewares/seller.auth.middleware');

router.get('/:id/create', authMiddleware.requireAuth, orderController.create);
router.post('/:slug/createnow', authMiddleware.requireAuth, orderController.createNow);
router.post('/store', authMiddleware.requireAuth, orderController.store);
router.get('/storenow', authMiddleware.requireAuth, orderController.storeNow);
router.get('/show', authMiddleware.requireAuth, orderController.show);
router.get('/notapproved', authMiddleware.requireAuth, orderController.notApprovedOrders);
router.get('/canceled', authMiddleware.requireAuth, orderController.canceledOrders);
router.get('/toship', authMiddleware.requireAuth, orderController.toShipOrders);
router.get('/shipping', authMiddleware.requireAuth, orderController.shippingOrders);
router.get('/completed', authMiddleware.requireAuth, orderController.completedOrders);
router.get('/return', authMiddleware.requireAuth, orderController.returnOrders);
router.post('/handle/create', authMiddleware.requireAuth, orderController.createMany);
router.get('/storemany', authMiddleware.requireAuth, orderController.storeMany);
router.get('/:id/confirm', authMiddleware.requireAuth, orderController.confirm);
router.get('/:id/return', authMiddleware.requireAuth, orderController.return);
router.get('/confirmed', authMiddleware.requireAuth, orderController.confirmedOrders);
router.post('/pay', orderController.paymentOrders)
router.post('/paynow', orderController.paymentOrderNow)

module.exports = router;