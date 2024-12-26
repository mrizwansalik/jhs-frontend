// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');

// get article comment object
const { getArticleCommentObject } = require('../../helper/ArticleComment');
const { Article } = require('../../models/article/article');
const { articleCommentValidate, ArticleComment } = require('../../models/article/articleComment');
const { ArticleDiscussion } = require('../../models/article/articleDiscussion');
const { getExtension } = require('../../utils/helperFunction');


exports.getArticleComment = catchAsync(async (req, res) => { 
    const article = await getArticleCommentObject('', req.userId);
    let doc = await article.getArticleComments(req.params.id, req.userId)
    
    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({ 
            message: 'Success',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

exports.getCommentReply = catchAsync(async (req, res) => {

    const commentInfo = await ArticleComment.findById(req.body.commentId);
    if (!commentInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    res.status(200).json(
        Response.success({
            message: 'Comment Reply found',
            status: 200,
            data: commentInfo,
            accessToken: req.token,
        })
    );

});

exports.getDiscussionReply = catchAsync(async (req, res) => {

    const commentInfo = await ArticleComment.findById(req.body.commentId).populate([`${req.body.commentType}`]);
    if (!commentInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    const replies = commentInfo[`${req.body.commentType}`];

    res.status(200).json(
        Response.success({
            message: 'Comment Reply found',
            status: 200,
            data: {'replies': replies},
            accessToken: req.token,
        })
    );

});

exports.getArticleDiscussionReply = catchAsync(async (req, res) => {

    const articleInfo = await Article.findById(req.body.articleId);
    if (!articleInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleDiscussionInfo = await ArticleDiscussion.findById(articleInfo.article_discussion_id).populate([`${req.body.commentType}`]);
    if (!articleDiscussionInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const replies = articleDiscussionInfo[`${req.body.commentType}`];

    res.status(200).json(
        Response.success({
            message: 'Comment Reply found',
            status: 200,
            data: {'replies': replies},
            accessToken: req.token,
        })
    );
});

exports.updateComment = catchAsync(async (req, res) => {

     // validate request body using Joi Validation define in Company Mongoes models
     const { error } = articleCommentValidate({
        text: req.body.text,
        highlight: req.body.highlight,
        forArticleElement: req.body.forArticleElement,
        commenterType: req.body.userType,
        addBy: req.userId,
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const commentInfo = await ArticleComment.findById(req.body.commentId);
    if (!commentInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    res.status(200).json(
        Response.success({
            message: 'Comment Reply found',
            status: 200,
            data: commentInfo.replies,
            accessToken: req.token,
        })
    );
});

exports.addCommentReply = catchAsync(async (req, res) => {
   
    const commentInfo = await ArticleComment.findById(req.body.commentId);
    const data = {
        text: req.body.text,
        type: 'text',
        addBy: req.userId,
    };
    commentInfo.replies.addToSet(data);
    commentInfo.save();

    // end success response
    res.status(200).json(
        Response.success({
            message: 'Reply is added!',
            status: 200,
            data: data,
            accessToken: req.token,
        })
    );
});

exports.commentReplyAttachments = catchAsync(async (req, res) => {
    var fileExtension = getExtension(req.body.file);
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
    var fileType = extensions.includes(fileExtension) ? "image" : "file";
    
    const commentInfo = await ArticleComment.findById(req.body.commentId);

    const data = {
        text: req.body.text,
        file: req.body.file,
        type: fileType,
        addBy: req.userId,
    };
    commentInfo.replies.addToSet(data);
    commentInfo.save();

    // end success response
    res.status(200).json(
        Response.success({
            message: 'Attachment uploaded!',
            status: 200,
            data: data,
            accessToken: req.token,
        })
    );
});