const express = require('express');
const router = express.Router();

const OrderController = require('../app/controllers/OrderController');

router.get('/cancel', OrderController.paypalCancel);

module.exports = router;