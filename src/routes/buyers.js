const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { check, validationResult} = require('express-validator');
const urlencodedParser = bodyParser.urlencoded({extended : false});

const buyerController = require('../app/controllers/BuyerController');
const authMiddleware = require('../middlewares/auth.middleware');

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' }) 

router.get('/sign-up', buyerController.create);
router.get('/login', buyerController.login);
router.get('/logout', buyerController.logout);
router.post('/store', buyerController.store);
router.post('/verifyaccount', buyerController.verifyaccount);
router.get('/info', authMiddleware.requireAuth, buyerController.buyerinfo);
router.put('/:id', upload.single('avatar'), authMiddleware.requireAuth, buyerController.update);
module.exports = router;