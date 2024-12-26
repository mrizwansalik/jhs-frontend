// third party import
const express = require('express');

// import Controller
const articleStatusController = require('../../app/controllers/article/articleStatusController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/:id/getArticleStatus', [checkFeaturePermission('articlestatus', 'view')], articleStatusController.getArticleStatus);
router.get('/:id/getArticleStatusWithParent', [checkFeaturePermission('articlestatus', 'view')], articleStatusController.getArticleStatusWithParent);
router.get('/getAllArticleStatus', [checkFeaturePermission('articlestatus', 'view')], articleStatusController.getAllArticleStatus);
router.get('/getAllArticleStatusWithParent', [checkFeaturePermission('articlestatus', 'view')], articleStatusController.getAllArticleStatusWithParent);
router.post('/addArticleStatus', [checkFeaturePermission('articlestatus', 'add')], articleStatusController.addArticleStatus);
router.put('/:articleStatusId/update', [checkFeaturePermission('articlestatus', 'update')], articleStatusController.updateArticleStatus);

module.exports = router;
