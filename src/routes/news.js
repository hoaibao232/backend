var express = require('express');
const NewsController = require('../app/controllers/NewsController');
var router = express.Router();

const newsController = require('../app/controllers/NewsController');

router.get('/:slug', newsController.show);
router.get('/', newsController.index);

module.exports = router;