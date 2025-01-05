// third party import
const express = require('express');

// import Controller
const articleRatingListController = require('../../app/controllers/articleRatingListController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/all', articleRatingListController.getAllArticleRatingList);

router.get('/:id/getArticleRatingList', [checkFeaturePermission('articleratinglist', 'view')], articleRatingListController.getArticleRatingList);
router.get('/:id/getByArticleRatingListName', [checkFeaturePermission('articleratinglist', 'view')], articleRatingListController.getByArticleRatingListName);

router.post('/:id/activateArticleRatingList', [checkFeaturePermission('articleratinglist', 'delete')], articleRatingListController.activateArticleRatingList);
router.post('/:id/deactivateArticleRatingList', [checkFeaturePermission('articleratinglist', 'delete')], articleRatingListController.deactivateArticleRatingList);

router.get('/getAllArticleRatingList', [checkFeaturePermission('articleratinglist', 'view')], articleRatingListController.getAllArticleRatingList);
router.post('/addArticleRatingList', [checkFeaturePermission('articleratinglist', 'add')], articleRatingListController.addArticleRatingList);

router.put('/:articleRatingListId/update', [checkFeaturePermission('articleratinglist', 'update')], articleRatingListController.updateArticleRatingList);

module.exports = router;
