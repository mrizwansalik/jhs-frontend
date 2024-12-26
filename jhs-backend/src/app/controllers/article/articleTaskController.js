
const { Response } = require('../../../framework');
const { getArticleTaskObject } = require('../../helper/ArticleTask/index');
const { Article } = require('../../models/article/article');
const { articleTaskValidate, ArticleTask, articleTaskCommentValidate, addChangeRequestValidate } = require('../../models/article/articleTask');
const APIFeatures = require('../../utils/apiFeatures');
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');

// get all article task
exports.getAllTask = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getArticleTaskObject(req.userId);
    let query = article.getTaskList(req.userId);

    const features = new APIFeatures(query, req.query)
        .filter()
        .sorting()
        .limitFields()
        .pagination();

    const doc = await features.query;

    res.status(200).json(
        Response.success({
            message: 'Success',
            status: 200,
            data: doc,
            pagination:features.query.paginated,
            accessToken: req.token,
        })
    );
});
exports.getAllArticleTaskList = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const articleId = req.body.articleId;

    const article = await getArticleTaskObject(req.userId);
    let query = article.getArticleTaskList(articleId, req.userId);

    const features = new APIFeatures(query, req.query)
        .filter()
        .sorting()
        .limitFields()
        .pagination();

    const doc = await features.query;

    res.status(200).json(
        Response.success({
            message: 'Success',
            status: 200,
            data: doc,
            pagination:features.query.paginated,
            accessToken: req.token,
        })
    );
});
// get specific article Status
exports.getTaskDetail = catchAsync(async (req, res) => {
    const task = await getArticleTaskObject(req.userId);
    let doc = await task.getTaskInfo(req.params.taskId)

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Task found with respective information` })
    );

    res.status(200).json(
        Response.success({
            message: 'Task found',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

// add task to specific article
exports.addTaskToArticle = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = articleTaskValidate({
        title: req.body.title,
        description: req.body.description,
        taskType: req.body.taskType,
        assignedTo: [req.body.assignedTo],
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const article = await Article.findById(req.body.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if(article.isEditable !== false){
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    } // end if

    const articleTask = new ArticleTask({
        title: req.body.title,
        description: req.body.description,
        assignedTo: [req.body.assignedTo],
        article: req.body.articleId,
        addBy: req.userId,
    });
    // adding user in db using mongoes user Object
    const taskResult = await articleTask.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Task is add for article!',
            data: taskResult,
            accessToken: req.token,
        })
    );
});

// mark task as complete
exports.markTaskAsComplete = catchAsync(async (req, res) => {
    const taskInfo = await ArticleTask.findById(req.params.taskId);
    if (!taskInfo) {
        // return with error of task not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    taskInfo.isCompleted = true;
    taskInfo.isCompletedAt = new Date();
    taskInfo.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Task is marked as complete!',
            data: taskInfo,
            accessToken: req.token,
        })
    );
});
// mark task as Done
exports.markTaskAsDone = catchAsync(async (req, res) => {
    const taskInfo = await ArticleTask.findById(req.params.taskId);
    if (!taskInfo) {
        // return with error of task not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    taskInfo.isDone = true;
    taskInfo.isDoneAt = new Date();
    taskInfo.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Task is marked as Done!',
            data: taskInfo,
            accessToken: req.token,
        })
    );
});

// get comment from specific task
exports.getTaskComment = catchAsync(async (req, res) => {
    const articleTask = await ArticleTask.findById(req.params.taskId);
    if (!articleTask) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Task with this id could not be found.' })
        );
    } // end if

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is add on task!',
            data: articleTask.comment,
            accessToken: req.token,
        })
    );
});
// add comment on specific task
exports.addCommentOnTask = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = articleTaskCommentValidate({
        text: req.body.text,
        commentBy: req.userId,
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const articleTask = await ArticleTask.findById(req.params.taskId);
    if (!articleTask) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Task with this id could not be found.' })
        );
    } // end if

    if(articleTask.isDone === true){
        return res.status(400).json(
            Response.error({ message: "You are not allow to comment on already done task" })
        );
    }

    const userComment = {
        text: req.body.text,
        commentBy: req.userId,
    }

    articleTask.comment.addToSet(userComment);
    const result = await articleTask.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is add on task!',
            data: result,
            accessToken: req.token,
        })
    );
});
// edit comment on specific task
exports.editTaskComment = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = articleTaskCommentValidate({
        text: req.body.text,
        commentBy: req.userId,
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    result = await ArticleTask.findOneAndUpdate(
        { '_id': req.params.taskId, "comment._id": req.body.commentId },
        {
            $set: {
                "comment.$.text": req.body.text,
                "comment.$.isEdited": true,
            }
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false,
        }
    );

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is updated!',
            data: result,
            accessToken: req.token,
        })
    );
});
// delete comment from specific task
exports.deleteTaskComment = catchAsync(async (req, res) => {

    result = await ArticleTask.findOneAndUpdate(
        { '_id': req.params.taskId, "comment._id": req.body.commentId },
        {
            $set: {
                "comment.$.isDeleted": true,
                "comment.$.isDeletedAt": new Date(),
            }
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false,
        }
    );

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is deleted!',
            data: result,
            accessToken: req.token,
        })
    );
});


// add comment on specific task
exports.addChangeRequest = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = addChangeRequestValidate({
        request: req.body.text,
        reason: req.body.reason,
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const articleTask = await ArticleTask.findById(req.params.taskId);
    if (!articleTask) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Task with this id could not be found.' })
        );
    } // end if

    if(articleTask.isCompleted === true && articleTask.isDone === true){
        return res.status(400).json(
            Response.error({ message: "You are not allow to add request on already done or complete task" })
        );
    }

    const userRequest = {
        request: req.body.text,
        reason: req.body.reason,
    }

    articleTask.change_editor.addToSet(userRequest);
    const result = await articleTask.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Editor Change request is add on task!',
            data: result,
            accessToken: req.token,
        })
    );
});
// mark task as Done
exports.changeEditor = catchAsync(async (req, res) => {
    const taskInfo = await ArticleTask.findById(req.params.taskId);
    if (!taskInfo) {
        // return with error of task not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    result = await ArticleTask.findOneAndUpdate(
        { '_id': req.params.taskId, "change_editor._id": req.body.changeRequesttId },
        {
            $set: {
                "comment.$.newEditor": req.body.editorId,
                "comment.$.status": 1,
                "comment.$.actionBy": req.body.editorId,
            }
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false,
        }
    );

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Task is marked as Done!',
            data: taskInfo,
            accessToken: req.token,
        })
    );
});