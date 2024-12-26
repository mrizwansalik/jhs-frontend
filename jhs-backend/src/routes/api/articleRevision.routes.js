// third party import
const express = require('express');

// import Controller
const articleRevisionController = require('../../app/controllers/article/articleRevisionController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const checkArticleManagerPermission = require('../../app/middleware/checkArticleManagerPermission');
const checkArticleRevisionPermission = require('../../app/middleware/checkArticleRevisionPermission');

const isAuth = require('../../app/middleware/auth');
const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();

router.get('/:id/getArticleRevision', [isAuth], articleRevisionController.getArticleRevision);
router.get('/:id/getArticleRevisionDetail', [isAuth], articleRevisionController.getArticleRevisionDetail);
router.get('/:id/getArticleRevisionReferencesTextList', [isAuth], articleRevisionController.getArticleRevisionReferencesTextList); 

// add article and update
router.put('/:articleId/updateRevision', [checkArticleRevisionPermission()], articleRevisionController.updateArticleRevision);
router.put('/:articleId/revision/validateArticleRevision', [checkFeaturePermission('article', 'update')], articleRevisionController.validateArticleRevision);
router.put('/:articleId/revision/submitArticleRevision', [checkFeaturePermission('article', 'update')], articleRevisionController.submitArticleRevision);

// article References
router.post('/:articleId/revision/addRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.addRevisionReference);
router.post('/:articleId/revision/generateRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.generateRevisionReference);
router.post('/:articleId/revision/launchRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.launchRevisionReference);
router.get('/:articleId/:reference/revision/getSpecificRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.getSpecificRevisionReference);
router.post('/:articleId/revision/updateRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.updateRevisionReference);
router.post('/:articleId/revision/removeRevisionReference', [checkFeaturePermission('article', 'update')], articleRevisionController.removeRevisionReference);
router.post('/:articleId/revision/updateRevisionReferenceSorting', [checkFeaturePermission('article', 'update')], articleRevisionController.updateRevisionReferenceSorting);

// article Figure
router.put('/:articleId/revision/addRevisionFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleRevisionController.addRevisionFigure);
router.post('/:articleId/revision/uploadRevisionFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleRevisionController.uploadRevisionFigure);
router.put('/:articleId/revision/updateRevisionFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleRevisionController.updateRevisionFigure);
router.put('/:articleId/revision/removeRevisionFigure', [checkFeaturePermission('article', 'update')], articleRevisionController.removeRevisionFigure);
router.post('/:articleId/revision/updateRevisionFigureSorting', [checkFeaturePermission('article', 'update')], articleRevisionController.updateRevisionFigureSorting);

// article Table
router.put('/:articleId/revision/addRevisionTable', [checkFeaturePermission('article', 'update')], articleRevisionController.addRevisionTable);
router.put('/:articleId/revision/updateRevisionTable', [checkFeaturePermission('article', 'update')], articleRevisionController.updateRevisionTable);
router.put('/:articleId/revision/removeRevisionTable', [checkFeaturePermission('article', 'update')], articleRevisionController.removeRevisionTable);
router.post('/:articleId/revision/updateRevisionTableSorting', [checkFeaturePermission('article', 'update')], articleRevisionController.updateRevisionTableSorting);


module.exports = router;
