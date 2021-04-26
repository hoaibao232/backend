const express = require('express');
const router = express.Router();

const cartController = require('../app/controllers/CartController');

router.post('/:slug/add', cartController.add);
router.get('/show', cartController.show);
router.delete('/:id', cartController.destroy);
router.put('/:id', cartController.update);

module.exports = router;