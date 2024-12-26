// third party import
const express = require('express');

// import Controller
const articleController = require('../../app/controllers/article/articleController');
const articleCommentController = require('../../app/controllers/article/articleCommentController');
const articleEditorController = require('../../app/controllers/article/articleEditorController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const checkArticleManagerPermission = require('../../app/middleware/checkArticleManagerPermission');
const isAuth = require('../../app/middleware/auth');
const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();

// get article
router.get('/:id/getArticle', [isAuth], articleController.getArticle);
router.get('/:id/getArticleAuthors', [isAuth], articleController.getArticleAuthors);
router.get('/:id/getArticleReviewers', [isAuth], articleController.getArticleReviewers); 
router.get('/:id/getArticleEditor', [isAuth], articleController.getArticleEditor);
router.get('/:id/getUnassignedUser', [isAuth], articleEditorController.getUnassignedUser);
router.get('/:id/getArticleComment', [isAuth], articleCommentController.getArticleComment);
router.post('/:id/getCommentReply', [isAuth], articleCommentController.getCommentReply);
router.post('/getDiscussionReply', [isAuth], articleCommentController.getDiscussionReply);
router.post('/getArticleDiscussionReply', [isAuth], articleCommentController.getArticleDiscussionReply);

router.post("/:id/addCommentReply", [isAuth], articleCommentController.addCommentReply);
router.post("/:id/commentReplyAttachments", [isAuth, fileMiddleware], articleCommentController.commentReplyAttachments);

router.post('/:id/exportCitation', [isAuth], articleController.exportCitation);

router.get('/:id/getArticleDetail', [isAuth], articleController.getArticleDetail);
router.get('/:id/getArticleReferencesTextList', [isAuth], articleController.getArticleReferencesTextList); 
router.get('/:id/getDraftArticleDetail', [isAuth], articleController.getDraftArticleDetail);
router.get('/:id/getDraftArticleReferencesTextList', [isAuth], articleController.getDraftArticleReferencesTextList); 

router.get('/:id/getArticleActionHistory', [isAuth], articleController.getArticleActionHistory);

router.get('/:invoiceId/createInvoice', articleController.createInvoice);

// get list of all article
router.get('/getAllArticle', [isAuth], articleController.getAllArticle);
router.get('/getAllDraftArticle', [isAuth], articleController.getAllDraftArticle);
router.get('/getAllAssignedArticles', [isAuth], articleController.getAllAssignedArticles);
router.get('/getAllReviewerArticles', [isAuth], articleController.getAllReviewerArticles);

// add article and update
router.post('/getStarted', [checkFeaturePermission('article', 'add')], articleController.getStarted);
router.put('/:articleId/update', [checkFeaturePermission('article', 'update')], articleController.updateArticle);
router.put('/:articleId/validateArticle', [checkFeaturePermission('article', 'update')], articleController.validateArticle);
router.put('/:articleId/submitArticle', [checkFeaturePermission('article', 'update')], articleController.submitArticle);

// article References
router.post('/:articleId/addReference', [checkFeaturePermission('article', 'update')], articleController.addReference);
router.post('/:articleId/generateReference', [checkFeaturePermission('article', 'update')], articleController.generateReference);
router.post('/:articleId/launchReference', [checkFeaturePermission('article', 'update')], articleController.launchReference);
router.get('/:articleId/:reference/getSpecificReference', [checkFeaturePermission('article', 'update')], articleController.getSpecificReference);
router.post('/:articleId/updateReference', [checkFeaturePermission('article', 'update')], articleController.updateReference);
router.post('/:articleId/removeReference', [checkFeaturePermission('article', 'update')], articleController.removeReference);
router.post('/:articleId/updateReferenceSorting', [checkFeaturePermission('article', 'update')], articleController.updateReferenceSorting);

// article Figure
router.put('/:articleId/addFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleController.addFigure);
router.post('/:articleId/uploadFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleController.uploadFigure);
router.put('/:articleId/updateFigure', [checkFeaturePermission('article', 'update'), fileMiddleware], articleController.updateFigure);
router.put('/:articleId/removeFigure', [checkFeaturePermission('article', 'update')], articleController.removeFigure);
router.post('/:articleId/updateFigureSorting', [checkFeaturePermission('article', 'update')], articleController.updateFigureSorting);

// article Table
router.put('/:articleId/addTable', [checkFeaturePermission('article', 'update')], articleController.addTable);
router.put('/:articleId/updateTable', [checkFeaturePermission('article', 'update')], articleController.updateTable);
router.put('/:articleId/removeTable', [checkFeaturePermission('article', 'update')], articleController.removeTable);
router.post('/:articleId/updateTableSorting', [checkFeaturePermission('article', 'update')], articleController.updateTableSorting);

// author assignment
router.put('/:articleId/assignAuthor', [checkFeaturePermission('article', 'update')], articleController.assignAuthor);
router.put('/:articleId/unassignAuthor', [checkFeaturePermission('article', 'update')], articleController.unassignAuthor);

// user assignment
router.put('/:articleId/makeUserAsManager', [checkArticleManagerPermission('article', 'assign')], articleEditorController.makeUserAsManager);
router.put('/:articleId/assignArticleToAssignee', [checkArticleManagerPermission('article', 'assign')], articleEditorController.assignArticleToAssignee);
router.put('/:articleId/addEditorUser', [checkArticleManagerPermission('article', 'assign')], articleEditorController.addEditorUser);
router.put('/:articleId/unassignUser', [checkArticleManagerPermission('article', 'unassign')], articleEditorController.unassignUser);

// reviewer assignment
router.put('/:articleId/assignReviewer', [checkFeaturePermission('article', 'assign')], articleController.assignReviewer);
router.put('/:articleId/unassignReviewer', [checkFeaturePermission('article', 'unassign')], articleController.unassignReviewer);

// article reviewer suggestion
router.put('/:articleId/suggestReviewer', [checkFeaturePermission('article', 'assign')], articleController.suggestReviewer);
router.put('/:articleId/unSuggestReviewer', [checkFeaturePermission('article', 'unassign')], articleController.unSuggestReviewer);

// delete article
router.post('/:articleId/deleteMyArticle', [isAuth], articleController.deleteMyArticle);

router.post("/commentAttachments", [isAuth, fileMiddleware], articleController.commentAttachments);
router.post("/discussionAttachments", [isAuth, fileMiddleware], articleController.discussionAttachments);

module.exports = router;
