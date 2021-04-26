var express = require('express');
const NewsController = require('../app/controllers/NewsController');
var router = express.Router();
const AuthCommon = require('../middlewares/auth.middleware.common');

const siteController = require('../app/controllers/SiteController');


router.get('/search', AuthCommon.requireAuth, siteController.search);
router.get('/', AuthCommon.requireAuth, siteController.index);

module.exports = router;