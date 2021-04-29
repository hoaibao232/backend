const express = require('express');
const router = express.Router();

const adminController = require('../app/controllers/AdminController');
const AuthAdmin = require('../middlewares/admin.auth.middleware');

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' }) 


router.get('/login', adminController.login);
router.get('/logout', adminController.logout);
router.post('/verifyaccount', adminController.verifyaccount);
router.get('/info', AuthAdmin.requireAuthAdmin, adminController.adminInfo);
router.put('/:id', AuthAdmin.requireAuthAdmin, upload.single('avatar'), adminController.update);
router.get('/stored/buyers', AuthAdmin.requireAuthAdmin, adminController.storedBuyers);
router.get('/stored/sellers', AuthAdmin.requireAuthAdmin, adminController.storedSellers);
router.get('/stored/buyers/:id/detail', AuthAdmin.requireAuthAdmin, adminController.showOrderBuyers);
router.get('/stored/buyers/:id/edit', AuthAdmin.requireAuthAdmin, adminController.editBuyers);
router.delete('/stored/buyers/:id/force', AuthAdmin.requireAuthAdmin, adminController.forceDestroy);
router.post('/stored/buyers/:id', upload.single('avatar'), AuthAdmin.requireAuthAdmin, adminController.updateInfoBuyers);

router.get('/stored/sellers/:id/edit', AuthAdmin.requireAuthAdmin, adminController.editSellers);
router.delete('/stored/sellers/:id/force', AuthAdmin.requireAuthAdmin, adminController.forceDestroySeller);
router.post('/stored/sellers/:id', upload.single('avatar'), AuthAdmin.requireAuthAdmin, adminController.updateInfoSellers);

router.get('/stored/books/:id/edit', AuthAdmin.requireAuthAdmin, adminController.editBooks);
router.put('/stored/books/:id', upload.single('avatar'), AuthAdmin.requireAuthAdmin, adminController.updateBooks);
router.delete('/stored/books/:id/force', AuthAdmin.requireAuthAdmin, adminController.forceDestroyBook);

router.get('/stored/sellers/:id', AuthAdmin.requireAuthAdmin, adminController.showOrderSellers);
router.get('/stored/books', AuthAdmin.requireAuthAdmin, adminController.storedBook);
router.get('/stored/books/seller', AuthAdmin.requireAuthAdmin, adminController.storedBookSeller);
router.get('/stored/books/seller/:id', AuthAdmin.requireAuthAdmin, adminController.storedBookSellerManage);
router.get('/stored/books/inactive', AuthAdmin.requireAuthAdmin, adminController.storedBookInactive);
router.get('/payment/unpaid', AuthAdmin.requireAuthAdmin, adminController.paymentUnpaid);
router.get('/payment/paid', AuthAdmin.requireAuthAdmin, adminController.paymentPaid);

router.get('/stored/orders/all', AuthAdmin.requireAuthAdmin, adminController.storedOrderAll);
router.get('/stored/orders/all/:id/edit', AuthAdmin.requireAuthAdmin, adminController.editOrder);
router.put('/stored/orders/all/:id', AuthAdmin.requireAuthAdmin, adminController.updateOrder);
router.delete('/stored/orders/all/:id/force', AuthAdmin.requireAuthAdmin, adminController.forceDestroyOrder);

router.get('/stored/orders/notApproved', AuthAdmin.requireAuthAdmin, adminController.storedOrdernotApproved);

router.get('/stored/orders/toShip', AuthAdmin.requireAuthAdmin, adminController.storedOrdertoShip);

router.get('/stored/orders/shipping', AuthAdmin.requireAuthAdmin, adminController.storedOrderShipping);

router.get('/stored/orders/completed', AuthAdmin.requireAuthAdmin, adminController.storedOrderCompleted);

router.get('/stored/orders/canceled', AuthAdmin.requireAuthAdmin, adminController.storedOrderCanceled);

router.get('/stored/orders/return', AuthAdmin.requireAuthAdmin, adminController.storedOrderReturn);

module.exports = router;