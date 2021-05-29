const express = require('express');
const router = express.Router();
const AuthSeller = require('../../middlewares/seller.auth.middleware');

const meController = require('../controllers/MeController');

router.get('/stored/books', meController.storedBooks); //done (thông tin books)
router.get('/stored/books/inactive', meController.inactiveBooks); //done (sách hết hàng)
router.get('/stored/books/active', meController.activeBooks); //done (sách còn hàng)
router.get('/trash/books', meController.trashBooks); //done (sách đã xóa mềm)
//router.get('/stored/orders', meController.storedOrders);
router.get('/stored/orders/all', meController.allOrders); //done (tất cả order)
router.post('/stored/orders/all/search', meController.searchOrders); //done (tất cả order)

router.post('/stored/handle-form-actions', meController.handleFormActions);

router.get('/stored/orders/notapproved', meController.notApprovedOrders); //done (order chưa chấp nhận)
router.get('/stored/orders/:id/approve',  meController.Approve); //done (chấp nhận order)
router.get('/stored/orders/:id/cancel',   meController.Cancel); //done (hủy order)
router.get('/stored/orders/canceled',  meController.canceledOrders); //done (order đã hủy)
router.get('/stored/orders/toship',  meController.toShipOrders); //done 

router.put('/stored/orders/:id/shipment-ready', meController.readyShip); //done

router.get('/stored/orders/shipping', meController.shippingOrders); //done

router.put('/stored/orders/:id/completed', meController.completed); //done

router.get('/stored/orders/completed', meController.completedOrders); //done
router.get('/stored/orders/return', meController.returnOrders); //done
router.get('/payment/paid', meController.paymentPaid); //done
router.get('/payment/unpaid', meController.paymentUnpaid); //done
// router.get('/stored/orders/all/search', AuthSeller.requireAuthSeller, meController.searchOrders);


module.exports = router;