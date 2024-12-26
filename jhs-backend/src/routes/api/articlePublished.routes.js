// third party import
const express = require('express');

// import Controller
const articlePublishedController = require('../../app/controllers/articlePublished/articlePublishedController');

// include middleware 
const isAuth = require('../../app/middleware/auth');
const fileMiddleware = require('../../app/middleware/upload')

const checkArticleManagerPermission = require('../../app/middleware/checkArticleManagerPermission');

const checkPublishedArticleAuthorPermission = require('../../app/middleware/published/checkPublishedArticleAuthorPermission');
const checkPublishedArticleEditorPermission = require('../../app/middleware/published/checkPublishedArticleEditorPermission');
const checkPublishedArticleManagerPermission = require('../../app/middleware/published/checkPublishedArticleManagerPermission');
const checkPublishedArticleReviewerPermission = require('../../app/middleware/published/checkPublishedArticleReviewerPermission');

const router = express.Router();

router.get('/getMyPublishedArticle', [isAuth], articlePublishedController.getMyPublishedArticle);

router.post('/:articleId/uploadArticlePDF', [checkArticleManagerPermission, fileMiddleware], articlePublishedController.uploadArticlePDF);

router.post('/:articleId/addPublisherRating', [checkPublishedArticleAuthorPermission('article', '')], articlePublishedController.addPublisherRating);
router.post('/:articleId/addReviewerRating', [checkPublishedArticleReviewerPermission('article', '')], articlePublishedController.addReviewerRating);
router.post('/:articleId/addEditorRating', [checkPublishedArticleEditorPermission('article', '')], articlePublishedController.addEditorRating);
router.post('/:articleId/addArticleRating', [isAuth], articlePublishedController.addArticleRating);

module.exports = router;
