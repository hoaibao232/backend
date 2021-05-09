const express = require('express');
const router = express.Router();
const AuthSeller = require('../../middlewares/seller.auth.middleware');

const meController = require('../controllers/MeController');

router.get('/stored/books',AuthSeller.requireAuthSeller, meController.storedBooks); //done (thông tin books)
router.get('/stored/books/inactive',AuthSeller.requireAuthSeller, meController.inactiveBooks); //done (sách hết hàng)
router.get('/stored/books/active',AuthSeller.requireAuthSeller, meController.activeBooks); //done (sách còn hàng)
router.get('/trash/books', AuthSeller.requireAuthSeller, meController.trashBooks); //done (sách đã xóa mềm)
//router.get('/stored/orders', meController.storedOrders);
router.get('/stored/orders/all', AuthSeller.requireAuthSeller, meController.allOrders); //done (tất cả order)
router.post('/stored/handle-form-actions',AuthSeller.requireAuthSeller, meController.handleFormActions);
router.get('/stored/orders/notapproved',AuthSeller.requireAuthSeller, meController.notApprovedOrders); //done (order chưa chấp nhận)
router.get('/stored/orders/:id/approve', AuthSeller.requireAuthSeller, meController.Approve); //done (chấp nhận order)
router.get('/stored/orders/:id/cancel', AuthSeller.requireAuthSeller, AuthSeller.requireAuthSeller, meController.Cancel); //done (hủy order)
router.get('/stored/orders/canceled', AuthSeller.requireAuthSeller, meController.canceledOrders); //done (order đã hủy)
router.get('/stored/orders/toship', AuthSeller.requireAuthSeller, meController.toShipOrders); //done 
router.put('/stored/orders/:id/shipment-ready', AuthSeller.requireAuthSeller, meController.readyShip); //done
router.get('/stored/orders/shipping', AuthSeller.requireAuthSeller, meController.shippingOrders); //done
router.put('/stored/orders/:id/completed',AuthSeller.requireAuthSeller, meController.completed); //done
router.get('/stored/orders/completed', AuthSeller.requireAuthSeller, meController.completedOrders); //done
router.get('/stored/orders/return', AuthSeller.requireAuthSeller, meController.returnOrders); //done
router.get('/payment/paid', AuthSeller.requireAuthSeller, meController.paymentPaid); //done
router.get('/payment/unpaid', AuthSeller.requireAuthSeller, meController.paymentUnpaid); //done
// router.get('/stored/orders/all/search', AuthSeller.requireAuthSeller, meController.searchOrders);


module.exports = router;