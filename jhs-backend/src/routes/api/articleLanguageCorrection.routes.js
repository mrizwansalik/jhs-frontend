// third party import
const express = require('express');

// import Controller
const articleLanguageCorrectionController = require('../../app/controllers/article/articleLanguageCorrectionController');

// include middleware 
const checkArticleLanguageCorrectionPermission = require('../../app/middleware/checkArticleLanguageCorrectionPermission');

const isAuth = require('../../app/middleware/auth');
const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();

router.get('/:id/getArticleLanguageCorrection', [isAuth], articleLanguageCorrectionController.getArticleLanguageCorrection);
router.get('/:id/getArticleLanguageCorrectionDetail', [isAuth], articleLanguageCorrectionController.getArticleLanguageCorrectionDetail);
router.get('/:id/getArticleLanguageCorrectionReferencesTextList', [isAuth], articleLanguageCorrectionController.getArticleLanguageCorrectionReferencesTextList);


// add article and update
router.put('/:articleId/updateLanguageCorrection', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateArticleLanguageCorrection);
router.put('/:articleId/languageCorrection/validateArticleLanguageCorrection', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.validateArticleLanguageCorrection);
router.put('/:articleId/languageCorrection/submitArticleLanguageCorrection', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.submitArticleLanguageCorrection);

// article References
router.post('/:articleId/languageCorrection/addLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.addLanguageCorrectionReference);
router.post('/:articleId/languageCorrection/generateLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.generateLanguageCorrectionReference);
router.post('/:articleId/languageCorrection/launchLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.launchLanguageCorrectionReference);
router.get('/:articleId/:reference/languageCorrection/getSpecificLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.getSpecificLanguageCorrectionReference);
router.post('/:articleId/languageCorrection/updateLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateLanguageCorrectionReference);
router.post('/:articleId/languageCorrection/removeLanguageCorrectionReference', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.removeLanguageCorrectionReference);
router.post('/:articleId/languageCorrection/updateLanguageCorrectionReferenceSorting', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateLanguageCorrectionReferenceSorting);

// article Figure
router.put('/:articleId/languageCorrection/addLanguageCorrectionFigure', [checkArticleLanguageCorrectionPermission('article', 'update'), fileMiddleware], articleLanguageCorrectionController.addLanguageCorrectionFigure);
router.post('/:articleId/languageCorrection/uploadLanguageCorrectionFigure', [checkArticleLanguageCorrectionPermission('article', 'update'), fileMiddleware], articleLanguageCorrectionController.uploadLanguageCorrectionFigure);
router.put('/:articleId/languageCorrection/updateLanguageCorrectionFigure', [checkArticleLanguageCorrectionPermission('article', 'update'), fileMiddleware], articleLanguageCorrectionController.updateLanguageCorrectionFigure);
router.put('/:articleId/languageCorrection/removeLanguageCorrectionFigure', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.removeLanguageCorrectionFigure);
router.post('/:articleId/languageCorrection/updateLanguageCorrectionFigureSorting', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateLanguageCorrectionFigureSorting);

// article Table
router.put('/:articleId/languageCorrection/addLanguageCorrectionTable', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.addLanguageCorrectionTable);
router.put('/:articleId/languageCorrection/updateLanguageCorrectionTable', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateLanguageCorrectionTable);
router.put('/:articleId/languageCorrection/removeLanguageCorrectionTable', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.removeLanguageCorrectionTable);
router.post('/:articleId/languageCorrection/updateLanguageCorrectionTableSorting', [checkArticleLanguageCorrectionPermission('article', 'update')], articleLanguageCorrectionController.updateLanguageCorrectionTableSorting);


module.exports = router;
