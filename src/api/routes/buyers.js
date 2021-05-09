const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { check, validationResult} = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({extended : false});
const buyerController = require('../controllers/BuyerController');
const Seller = require('../../app/controllers/models/Seller');
const authMiddleware = require('../../middlewares/auth.middleware');

var multer  = require('multer');
var upload = multer({ dest: './public/uploads/' }) 

// router.get('/sign-up', buyerController.create);
// router.get('/login', buyerController.login);
router.get('/logout', buyerController.logout); //done  
router.post('/store', buyerController.store); //done (xử lý đăng kí)
router.post('/verifyaccount', buyerController.verifyaccount); //done (xử lý đăng nhập)
router.get('/info', authMiddleware.requireAuth, buyerController.buyerinfo); //done (show info)
router.put('/:id', upload.single('avatar'), authMiddleware.requireAuth, buyerController.update); //done (update info)
module.exports = router;