const express = require('express');
const router = express.Router();

const cartController = require('../controllers/CartController');

router.post('/:slug/add', cartController.add); //done
router.get('/show', cartController.show); //done
router.delete('/:id', cartController.destroy); //done
router.put('/:id', cartController.update);   //done

module.exports = router;