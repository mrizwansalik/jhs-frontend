// third party import
const express = require('express');

// import Controller
const articleMetaController = require('../../app/controllers/article/articleMetaController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/:id/getArticleMeta', [checkFeaturePermission('articlemeta', 'view')], articleMetaController.getArticleMeta);
router.get('/getAllArticleMeta', [checkFeaturePermission('articlemeta', 'view')], articleMetaController.getAllArticleMeta);
router.post('/addArticleMeta', [checkFeaturePermission('articlemeta', 'add')], articleMetaController.addArticleMeta);
router.put('/:articleMetaId/update', [checkFeaturePermission('articlemeta', 'update')], articleMetaController.updateArticleMeta);

module.exports = router;

