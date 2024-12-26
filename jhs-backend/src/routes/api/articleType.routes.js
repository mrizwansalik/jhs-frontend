// third party import
const express = require('express');

// import Controller
const articleTypeController = require('../../app/controllers/article/articleTypeController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const isAuth = require('../../app/middleware/auth');

const router = express.Router();

router.get('/:id/getArticleType', [checkFeaturePermission('articletype', 'view')], articleTypeController.getArticleType);
router.get('/getAllArticleType', [isAuth], articleTypeController.getAllArticleType);
router.post('/addArticleType', [checkFeaturePermission('articletype', 'add')], articleTypeController.addArticleType);
router.put('/:articleTypeId/update', [checkFeaturePermission('articletype', 'update')], articleTypeController.updateArticleType);

module.exports = router;
