const express = require('express');
const orderController = require('../controllers/OrderController');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const AuthSeller = require('../../middlewares/seller.auth.middleware');

router.get('/:id/create', authMiddleware.requireAuth, orderController.create);
router.post('/:slug/createnow', authMiddleware.requireAuth, orderController.createNow); //done (tạo order từ Mua Ngay(1 sp))
router.post('/store', authMiddleware.requireAuth, orderController.store); 
router.get('/storenow', authMiddleware.requireAuth, orderController.storeNow); //done (xử lý order từ Mua Ngay)
router.get('/show', orderController.show); //done
router.get('/notapproved', authMiddleware.requireAuth, orderController.notApprovedOrders); //done
router.get('/canceled', authMiddleware.requireAuth, orderController.canceledOrders); //done
router.get('/toship', authMiddleware.requireAuth, orderController.toShipOrders); //done
router.get('/shipping', authMiddleware.requireAuth, orderController.shippingOrders); //done
router.get('/completed', authMiddleware.requireAuth, orderController.completedOrders); //done
router.get('/return', authMiddleware.requireAuth, orderController.returnOrders); //done
router.post('/handle/create', orderController.createMany); //done (tạo order từ Cart(1 hoặc nhiều sp))
router.post('/storemany',  orderController.storeMany); //done (xử lý nhiều order từ giỏ hàng)
router.get('/:id/confirm', authMiddleware.requireAuth, orderController.confirm); //done 
router.get('/:id/return', authMiddleware.requireAuth, orderController.return); //done
router.get('/confirmed', authMiddleware.requireAuth, orderController.confirmedOrders); //done
router.post('/pay', orderController.paymentOrders) //done (payment từ Mua Ngay)
router.post('/paynow', orderController.paymentOrderNow) //done (payment từ Cart)

module.exports = router;