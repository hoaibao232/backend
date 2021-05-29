const express = require('express');
const router = express.Router();
const AuthCommon = require('../../middlewares/auth.middleware.common');
var multer  = require('multer');
const BooksController = require('../controllers/BooksController');
const AuthSeller = require('../../middlewares/seller.auth.middleware');
const { route } = require('../../routes/me');
var upload = multer({ dest: './public/uploads/' }) 
    
router.get('/byte/:slug', BooksController.byteSlug); //done
router.get('/byte', BooksController.byte)

router.get('/create', BooksController.create);
router.post('/store', upload.single('image'), BooksController.store); //done
router.get('/:id/edit', BooksController.edit);
router.put('/:id', upload.single('image'), BooksController.update); //done
router.patch('/:id/restore', BooksController.restore); //done
router.delete('/:id', BooksController.destroy); //done
router.delete('/:id/force', BooksController.forceDestroy); //done
router.get('/:slug', BooksController.show); //done

module.exports = router;