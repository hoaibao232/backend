const express = require('express');
const router = express.Router();
const AuthSeller = require('../middlewares/seller.auth.middleware');

const meController = require('../app/controllers/MeController');

router.get('/stored/books',AuthSeller.requireAuthSeller, meController.storedBooks);
router.get('/stored/books/inactive',AuthSeller.requireAuthSeller, meController.inactiveBooks);
router.get('/stored/books/active',AuthSeller.requireAuthSeller, meController.activeBooks);
router.get('/trash/books', AuthSeller.requireAuthSeller, meController.trashBooks);
//router.get('/stored/orders', meController.storedOrders);
router.get('/stored/orders/all', AuthSeller.requireAuthSeller, meController.allOrders);
router.post('/stored/handle-form-actions',AuthSeller.requireAuthSeller, meController.handleFormActions);
router.get('/stored/orders/notapproved',AuthSeller.requireAuthSeller, meController.notApprovedOrders);
router.get('/stored/orders/:id/approve', AuthSeller.requireAuthSeller, meController.Approve);
router.get('/stored/orders/:id/cancel', AuthSeller.requireAuthSeller, AuthSeller.requireAuthSeller, meController.Cancel);
router.get('/stored/orders/canceled', AuthSeller.requireAuthSeller, meController.canceledOrders);
router.get('/stored/orders/toship', AuthSeller.requireAuthSeller, meController.toShipOrders);
router.get('/stored/orders/:id/shipment-ready', AuthSeller.requireAuthSeller, meController.readyShip);
router.get('/stored/orders/shipping', AuthSeller.requireAuthSeller, meController.shippingOrders);
router.get('/stored/orders/:id/completed',AuthSeller.requireAuthSeller, meController.completed);
router.get('/stored/orders/completed', AuthSeller.requireAuthSeller, meController.completedOrders);
router.get('/stored/orders/return', AuthSeller.requireAuthSeller, meController.returnOrders);
router.get('/payment/paid', AuthSeller.requireAuthSeller, meController.paymentPaid);
router.get('/payment/unpaid', AuthSeller.requireAuthSeller, meController.paymentUnpaid);
router.get('/stored/orders/all/search', AuthSeller.requireAuthSeller, meController.searchOrders);


module.exports = router;