const express = require('express');
const orderController = require('../controllers/OrderController');
const router = express.Router();
const authMiddleware = require('../../middlewares/auth.middleware');
const AuthSeller = require('../../middlewares/seller.auth.middleware');

router.get('/:id/create', orderController.create);
router.post('/:slug/createnow', orderController.createNow); //done (tạo order từ Mua Ngay(1 sp))
router.post('/store', orderController.store); 
router.get('/storenow', orderController.storeNow); //done (xử lý order từ Mua Ngay)
router.get('/show', orderController.show); //done
router.get('/notapproved', orderController.notApprovedOrders); //done
router.get('/canceled', orderController.canceledOrders); //done
router.get('/toship', orderController.toShipOrders); //done
router.get('/shipping', orderController.shippingOrders); //done
router.get('/completed', orderController.completedOrders); //done
router.get('/return', orderController.returnOrders); //done
router.post('/handle/create', orderController.createMany); //done (tạo order từ Cart(1 hoặc nhiều sp))
router.post('/storemany',  orderController.storeMany); //done (xử lý nhiều order từ giỏ hàng)
router.get('/:id/confirm', orderController.confirm); //done 
router.get('/:id/return', orderController.return); //done
router.get('/confirmed', orderController.confirmedOrders); //done
router.post('/pay', orderController.paymentOrders) //done (payment từ Mua Ngay)
router.post('/paynow', orderController.paymentOrderNow) //done (payment từ Cart)

module.exports = router;