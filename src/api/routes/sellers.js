const express = require('express');
const router = express.Router();

const sellerController = require('../controllers/SellerController');
const AuthSeller = require('../../middlewares/seller.auth.middleware');

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' }) 

router.get('/sign-up', sellerController.create);
router.get('/login', sellerController.login);
router.get('/logout', sellerController.logout); //done
router.get('/info', sellerController.sellerinfo); //done
router.put('/:id', upload.single('avatar'), sellerController.update); //done , upload.single('avatar'), AuthSeller.requireAuthSeller
router.post('/store', sellerController.store); //done
router.post('/verifyaccount', sellerController.verifyaccount); //done
module.exports = router;