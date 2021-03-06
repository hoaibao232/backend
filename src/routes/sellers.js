const express = require('express');
const router = express.Router();

const sellerController = require('../app/controllers/SellerController');
const AuthSeller = require('../middlewares/seller.auth.middleware');

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' }) 

router.get('/sign-up', sellerController.create);
router.get('/login', sellerController.login);
router.get('/logout', sellerController.logout);
router.get('/info', AuthSeller.requireAuthSeller, sellerController.sellerinfo);
router.put('/:id', upload.single('avatar'), AuthSeller.requireAuthSeller, sellerController.update);
router.post('/store', sellerController.store);
router.post('/verifyaccount', sellerController.verifyaccount);
module.exports = router;