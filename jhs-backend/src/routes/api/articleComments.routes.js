// third party import
const express = require('express');

// import Controller
const articleProcessingController = require('../../app/controllers/article/articleProcessingController');

// include middleware 
const checkArticleProcessingPermission = require('../../app/middleware/checkArticleProcessingPermission');
const checkArticleCommentPermission = require('../../app/middleware/checkArticleCommentPermission');
const isAuth = require('../../app/middleware/auth');

const router = express.Router();

router.post('/:commentId/getComment', [isAuth], articleProcessingController.getComment);
router.post('/:articleId/addComment', [checkArticleProcessingPermission()], articleProcessingController.addComment);
router.post('/:articleId/addCommentReply', [isAuth], articleProcessingController.addCommentReply);
router.post('/:articleId/:commentId/markCommentComplete', [checkArticleCommentPermission()], articleProcessingController.markCommentComplete);

module.exports = router;
