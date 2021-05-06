const express = require('express');
const router = express.Router();
const AuthCommon = require('../../middlewares/auth.middleware.common');
var multer  = require('multer');
const BooksController = require('../controllers/BooksController');
const AuthSeller = require('../../middlewares/seller.auth.middleware');
const { route } = require('../../routes/me');
var upload = multer({ dest: './public/uploads/' }) 

router.get('/sendFile', BooksController.sendFile)

router.get('/create', AuthSeller.requireAuthSeller, BooksController.create);
router.post('/store', upload.single('image'), BooksController.store); //done
router.get('/:id/edit', AuthSeller.requireAuthSeller, BooksController.edit);
router.put('/:id', upload.single('image'), AuthSeller.requireAuthSeller, BooksController.update); //done
router.patch('/:id/restore', AuthSeller.requireAuthSeller, BooksController.restore); //done
router.delete('/:id', AuthSeller.requireAuthSeller, BooksController.destroy); //done
router.delete('/:id/force', AuthSeller.requireAuthSeller, BooksController.forceDestroy); //done
router.get('/:slug', BooksController.show); //done

module.exports = router;