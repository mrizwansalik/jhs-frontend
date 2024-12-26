// third party import
const express = require('express');

// import Controller
const HomeController = require('../../app/controllers/HomeController');

// include middleware 
const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();


router.get('/getPublicArticleType', HomeController.getPublicArticleType);
router.get('/getPublicAuthor', HomeController.getPublicAuthor);
router.get('/getTrendingKeywords', HomeController.getTrendingKeywords);


router.get('/getPublicAuthorList', HomeController.getPublicAuthorList);
router.get('/:id/getPublicSingleAuthor',  HomeController.getPublicSingleAuthor);

// get article
router.get('/getCurrentIssuesArticles', HomeController.getCurrentIssuesArticles);
router.get('/getTrendingCategoriesList', HomeController.getTrendingCategoriesList);
router.get('/getArticleList', HomeController.getArticleList);

router.get('/:id/getPublishedArticleDetail',  HomeController.getPublishedArticleDetail);
router.get('/:id/getPublishedArticleMatrices',  HomeController.getPublishedArticleMatrices);

router.get('/:id/getPublishedArticleAuthors', HomeController.getPublishedArticleAuthors);
router.get('/:id/getPublishedArticleReviewers', HomeController.getPublishedArticleReviewers); 
router.get('/:id/getPublishedArticleReferencesTextList', HomeController.getPublishedArticleReferencesTextList); 

router.post('/:id/exportCitation', HomeController.exportCitation);
router.get('/:id/downloadPDF', HomeController.downloadPDF);

module.exports = router;
