// third party import
const express = require('express');

// import Controller
const articleTaskController = require('../../app/controllers/article/articleTaskController');

const checkArticleManagerPermission = require('../../app/middleware/checkArticleManagerPermission');

const checkArticleTaskEditorPermission = require('../../app/middleware/checkArticleTaskEditorPermission');
const checkArticleTaskCreatorPermission = require('../../app/middleware/checkArticleTaskCreatorPermission');


const isAuth = require('../../app/middleware/auth');
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/getAllTask', [isAuth], articleTaskController.getAllTask);
router.get('/getAllArticleTaskList', [isAuth], articleTaskController.getAllArticleTaskList);

router.get('/:taskId/getTaskDetail', [isAuth], articleTaskController.getTaskDetail);

router.post('/addTaskToArticle', [checkFeaturePermission('task', 'add')], articleTaskController.addTaskToArticle);

router.post('/:taskId/markTaskAsComplete', [checkArticleTaskEditorPermission('task', 'complete')], articleTaskController.markTaskAsComplete);
router.post('/:taskId/markTaskAsDone', [checkArticleTaskCreatorPermission('task', 'done')], articleTaskController.markTaskAsDone);

router.post('/:taskId/addCommentOnTask', [checkArticleTaskEditorPermission('task', 'view')], articleTaskController.addCommentOnTask);
router.post('/:taskId/updateCommentOnTask', [checkArticleTaskEditorPermission('task', 'update')], articleTaskController.addCommentOnTask);
router.post('/:taskId/editTaskComment', [checkArticleTaskEditorPermission('task', 'update')], articleTaskController.editTaskComment);
router.post('/:taskId/deleteTaskComment', [checkArticleTaskEditorPermission('task', 'delete')], articleTaskController.deleteTaskComment);

router.post('/:taskId/addChangeRequest', [checkArticleTaskEditorPermission('task', 'add')], articleTaskController.addChangeRequest);
router.post('/:taskId/changeEditor', [checkArticleManagerPermission('task', 'update')], articleTaskController.addCommentOnTask);
router.post('/:taskId/acceptChangeRequestWithNewEditor', [checkArticleManagerPermission('task', 'accept')], articleTaskController.editTaskComment);
router.post('/:taskId/acceptChangeRequest', [checkArticleManagerPermission('task', 'accept')], articleTaskController.editTaskComment);
router.post('/:taskId/rejectChangeRequest', [checkArticleManagerPermission('task', 'reject')], articleTaskController.deleteTaskComment);

module.exports = router;
