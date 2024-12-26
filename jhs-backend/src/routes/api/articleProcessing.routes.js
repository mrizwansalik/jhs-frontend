// third party import
const express = require('express');

// import Controller
const articleProcessingController = require('../../app/controllers/article/articleProcessingController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const checkArticleProcessingPermission = require('../../app/middleware/checkArticleProcessingPermission');
const checkArticleReviewerPermission = require('../../app/middleware/checkArticleReviewerPermission');
const checkArticleAuthorPermission = require('../../app/middleware/checkArticleAuthorPermission');
const checkArticleEditorPermission = require('../../app/middleware/checkArticleEditorPermission');
const checkArticleCommentPermission = require('../../app/middleware/checkArticleCommentPermission');
const isAuth = require('../../app/middleware/auth');
const checkChangeArticleProcessingPermission = require('../../app/middleware/checkChangeArticleProcessingPermission');

const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();
const checkArticleManagerPermission = require('../../app/middleware/checkArticleManagerPermission');

router.post('/:articleId/acceptArticleOnSubmission', [checkFeaturePermission('article', 'approve')], articleProcessingController.acceptArticleOnSubmission);
router.post('/:articleId/payArticlePayment', [checkArticleAuthorPermission()], articleProcessingController.payArticlePayment);

router.post('/:articleId/requestForRevision', [checkArticleAuthorPermission('article', '')], articleProcessingController.requestForRevision);
router.post('/:articleId/approveRequestForRevision', [checkArticleManagerPermission('article', 'approve')], articleProcessingController.approveRequestForRevision);
router.post('/:articleId/rejectRequestForRevision', [checkArticleManagerPermission('article', 'reject')], articleProcessingController.rejectRequestForRevision);

router.post('/:articleId/acceptArticleRevision', [checkArticleManagerPermission('article', 'approve')], articleProcessingController.acceptArticleRevision);
router.post('/:articleId/rejectArticleRevision', [checkArticleManagerPermission('article', 'reject')], articleProcessingController.rejectArticleRevision);

router.put('/:articleId/moveArticleToLanguageCheck', checkChangeArticleProcessingPermission(), checkArticleProcessingPermission(), articleProcessingController.moveArticleToLanguageCheck);
router.post('/:articleId/acceptArticleFromLanguageCheck', checkArticleManagerPermission('article', 'approve'), articleProcessingController.acceptArticleFromLanguageCheck);
router.post('/:articleId/rejectArticleFromLanguageCheck', checkArticleManagerPermission('article', 'reject'), articleProcessingController.rejectArticleFromLanguageCheck);

router.post('/:articleId/acceptRequestForLanguageCorrection', [checkArticleManagerPermission('article', 'approve')], articleProcessingController.acceptRequestForLanguageCorrection);
router.post('/:articleId/startLanguageCorrection', [checkArticleManagerPermission('article', 'approve')], articleProcessingController.startLanguageCorrection);

router.post('/:articleId/acceptArticleLanguageCorrection', [checkArticleManagerPermission('article', 'approve')], articleProcessingController.acceptArticleLanguageCorrection);
router.post('/:articleId/rejectArticleLanguageCorrection', [checkArticleManagerPermission('article', 'reject')], articleProcessingController.rejectArticleLanguageCorrection);

router.post('/:articleId/requestArticleForLanguageCorrection', [checkArticleAuthorPermission('article', '')], articleProcessingController.requestArticleForLanguageCorrection);
router.post('/:articleId/completeLanguageCorrection', [checkArticleEditorPermission('article', 'changestatus')], articleProcessingController.completeLanguageCorrection);

router.post('/:articleId/acceptArticleFromPeerReview', [checkArticleReviewerPermission('article', 'approve')], articleProcessingController.acceptArticleFromPeerReview);
router.post('/:articleId/rejectArticleFromPeerReview', [checkArticleReviewerPermission('article', 'reject')], articleProcessingController.rejectArticleFromPeerReview);

router.post('/:articleId/acceptArticleFromGalleryProof', [checkArticleAuthorPermission('article', 'approve')], articleProcessingController.acceptArticleFromGalleryProof);

router.post('/:articleId/publishArticle', [checkArticleManagerPermission('articlepublished', 'add'), fileMiddleware], articleProcessingController.publishArticle);

router.post('/:commentId/getComment', [isAuth], articleProcessingController.getComment);
router.post('/:articleId/addComment', [checkArticleProcessingPermission()], articleProcessingController.addComment);
router.post('/:articleId/addCommentReply', [checkArticleProcessingPermission()], articleProcessingController.addCommentReply);
router.post('/:articleId/:commentId/markCommentComplete', [checkArticleCommentPermission()], articleProcessingController.markCommentComplete);

module.exports = router;
