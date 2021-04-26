const express = require('express');
const router = express.Router();

const BooksController = require('../app/controllers/BooksController');
const AuthSeller = require('../middlewares/seller.auth.middleware');
const AuthCommon = require('../middlewares/auth.middleware.common');

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' }) 

router.get('/create', AuthSeller.requireAuthSeller, BooksController.create);
router.post('/store', upload.single('image'), AuthSeller.requireAuthSeller, BooksController.store);
router.get('/:id/edit', AuthSeller.requireAuthSeller, BooksController.edit);
router.put('/:id', upload.single('image'), AuthSeller.requireAuthSeller, BooksController.update);
router.patch('/:id/restore', AuthSeller.requireAuthSeller, BooksController.restore);
router.delete('/:id', AuthSeller.requireAuthSeller, BooksController.destroy);
router.delete('/:id/force', AuthSeller.requireAuthSeller, BooksController.forceDestroy);
router.get('/:slug', AuthCommon.requireAuth, BooksController.show);

module.exports = router;