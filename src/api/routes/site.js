var express = require('express');
const SiteController = require('../controllers/SiteController');
var router = express.Router();
const AuthCommon = require('../../middlewares/auth.middleware.common');

router.post('/search', AuthCommon.requireAuth, SiteController.search);
router.get('/', AuthCommon.requireAuth, SiteController.index);

module.exports = router;