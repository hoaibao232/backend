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
router.post('/store', upload.single('image'), BooksController.store);
router.get('/:id/edit', AuthSeller.requireAuthSeller, BooksController.edit);
router.put('/:id', upload.single('image'), AuthSeller.requireAuthSeller, BooksController.update);
router.patch('/:id/restore', AuthSeller.requireAuthSeller, BooksController.restore);
router.delete('/:id', AuthSeller.requireAuthSeller, BooksController.destroy);
router.delete('/:id/force', AuthSeller.requireAuthSeller, BooksController.forceDestroy);
router.get('/:slug', BooksController.show);

module.exports = router;