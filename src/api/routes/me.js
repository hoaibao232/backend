const express = require('express');
const router = express.Router();
const AuthSeller = require('../../middlewares/seller.auth.middleware');

const meController = require('../controllers/MeController');

router.get('/stored/books',AuthSeller.requireAuthSeller, meController.storedBooks); //done
router.get('/stored/books/inactive',AuthSeller.requireAuthSeller, meController.inactiveBooks); //done
router.get('/stored/books/active',AuthSeller.requireAuthSeller, meController.activeBooks); //done
router.get('/trash/books', AuthSeller.requireAuthSeller, meController.trashBooks); //done
//router.get('/stored/orders', meController.storedOrders);
router.get('/stored/orders/all', AuthSeller.requireAuthSeller, meController.allOrders); //done
router.post('/stored/handle-form-actions',AuthSeller.requireAuthSeller, meController.handleFormActions);
router.get('/stored/orders/notapproved',AuthSeller.requireAuthSeller, meController.notApprovedOrders); //done
router.get('/stored/orders/:id/approve', AuthSeller.requireAuthSeller, meController.Approve); //done
router.get('/stored/orders/:id/cancel', AuthSeller.requireAuthSeller, AuthSeller.requireAuthSeller, meController.Cancel); //done
router.get('/stored/orders/canceled', AuthSeller.requireAuthSeller, meController.canceledOrders); //done
router.get('/stored/orders/toship', AuthSeller.requireAuthSeller, meController.toShipOrders); //done
router.put('/stored/orders/:id/shipment-ready', AuthSeller.requireAuthSeller, meController.readyShip); //done
router.get('/stored/orders/shipping', AuthSeller.requireAuthSeller, meController.shippingOrders); //done
router.put('/stored/orders/:id/completed',AuthSeller.requireAuthSeller, meController.completed); //done
router.get('/stored/orders/completed', AuthSeller.requireAuthSeller, meController.completedOrders); //done
router.get('/stored/orders/return', AuthSeller.requireAuthSeller, meController.returnOrders); //done
router.get('/payment/paid', AuthSeller.requireAuthSeller, meController.paymentPaid); //done
router.get('/payment/unpaid', AuthSeller.requireAuthSeller, meController.paymentUnpaid); //done
router.get('/stored/orders/all/search', AuthSeller.requireAuthSeller, meController.searchOrders);


module.exports = router;