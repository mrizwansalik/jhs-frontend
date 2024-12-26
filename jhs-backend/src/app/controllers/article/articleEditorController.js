// third party import
const jwt = require('jsonwebtoken');
//const Citation = require('citation');

// import models
const { ArticleEditor } = require('../../models/article/articleEditor');
const { Article } = require('../../models/article/article');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// import config information
const clientSecret = require("../../config/clientSecret.config");
const { User } = require('../../models/user');
const { getArticleObject } = require('../../helper/Article');
const ArticleHelper = require('../../helper/Article/ArticleHelper');
const { addArticleEditorHistory } = require('../../utils/article/history');

// get all article editor
exports.getAllArticleEditor = factory.getAll(ArticleEditor);
exports.getAllArticleEditorWithEditorList = factory.getAll(ArticleEditor, "editorList");

// get specific article editor
exports.getArticleEditor = factory.getOne(ArticleEditor);
exports.getArticleEditorWithEditorList = factory.getOne(ArticleEditor, "editorList");
exports.getArticleEditorDetail = factory.getOne(ArticleEditor, ["editorList", "article_data_id", "_author"]);

// get start for creating new article
exports.makeUserAsManager = catchAsync(async (req, res) => {

    const articleId = req.params.articleId;
    let article = await Article.findById(articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const editorId = req.body.editorId;

    let editorList = article.editors;

    if(editorList.includes(editorId)){
        const managedByInfo = {
            managedBy: { "_id": editorId },
        }
        article.set(managedByInfo);
        await article.save();
    }

    const articleObj = await getArticleObject('', req.userId);
    let doc = await articleObj.getArticleDetail(articleId, req.userId)

    await addArticleEditorHistory(article.history, "New Manager is assigned to article", req.userId, editorId);

    // set response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Manager assigned to article!",
            data: doc,
            accessToken: req.token,
        })
    );
});
exports.addEditorUser = catchAsync(async (req, res) => {

    const articleId = req.params.articleId;
    const article = await Article.findById(articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const editorId = req.body.editorId;
    const editor = await User.findById(editorId);
    if (!editor) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Editor information is invalid` })
        );
    } // end if

    article.editors.addToSet(editor);

    await article.save();

    const articleObj = await getArticleObject('', req.userId);
    let doc = await articleObj.getArticleDetail(articleId, req.userId)

    await addArticleEditorHistory(article.history, "Add User to editor list", req.userId, editorId);

    // set response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "User added to article editor list!",
            data: doc,
            accessToken: req.token,
        })
    );
});
exports.assignArticleToAssignee = catchAsync(async (req, res) => {

    const articleId = req.params.articleId;
    let article = await Article.findById(articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const editorId = req.body.editorId;

    let editorList = article.editors;

    if(editorList.includes(editorId)){
        const assignedToInfo = {
            assignedTo: { "_id": editorId },
        }
        article.set(assignedToInfo);
        await article.save();
    }

    const articleObj = await getArticleObject('', req.userId);
    let doc = await articleObj.getArticleDetail(articleId, req.userId)

    await addArticleEditorHistory(article.history, "Article is assigned to editor", req.userId, editorId);

    // set response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Article is assigned to editor!",
            data: doc,
            accessToken: req.token,
        })
    );
});
exports.unassignUser = catchAsync(async (req, res) => {

    const articleId = req.params.articleId;
    let article = await Article.findById(articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const editorId = req.body.editorId;

    let result = await article.updateOne(
        { $pull: { "editors": editorId } },
        { multi: true }
    );
    result = await Article.findById(articleId);

    if (result.assignedTo == editorId) {
        const articleInfo = {
            assignedTo: null,
        }
        await result.set(articleInfo);
    }

    const articleObj = await getArticleObject('', req.userId);
    let doc = await articleObj.getArticleDetail(articleId, req.userId)

    await addArticleEditorHistory(article.history, "User is unassigned form article", req.userId, editorId);

    // set response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "User unassigned from article!",
            data: doc,
            accessToken: req.token,
        })
    );
});

exports.getUnassignedUser = catchAsync(async (req, res) => {

    const articleId = req.params.id;
    let article = await Article.findOne({
        _id: articleId,
    });

    let reviewerList = article.reviewerList;
    let authorList = article.authorList;
    let editorList = article.editors;

    let users = reviewerList.concat(authorList);
    users = users.concat(editorList);
    users.push(article._author);

    const unassignUser = await User.find({
        '_id': { "$nin": users }
    });

    let list = unassignUser.map((data, index) => {
        return {
            'id': data?._id,
            'name': data?.full_name ?? "Unnamed User " + (index + 1),
            'occupation': data?.occupation ?? "-",
            'email': data?.email ?? "Email hidden",
        }
    });

    // set response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "User List!",
            data: list,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.updateArticleEditor = catchAsync(async (req, res) => {

    const articleInfo = {
        title: req.body.title,
        type: req.body.type,
        abstract: req.body.abstract,
        keywords: req.body.keywords,
        category: req.body.category,
        journal_info: req.body.journal_info,
        isDraft: req.body.isDraft,
    }

    const articleDataInfo = {
        introduction: req.body.introduction,
        methodology: req.body.methodology,
        result: req.body.result,
        case_presentation: req.body.case_presentation,
        discussion: req.body.discussion,
        conclusion: req.body.conclusion,
        acknowledgement: req.body.acknowledgement,
        disclosure: req.body.disclosure,
        supplementary: req.body.supplementary,
    }

    // validate request body using Joi Validation define in ArticleEditor Mongoes models
    const { error } = articleUpdateValidate({ ...articleInfo, ...articleDataInfo });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find article status and update
    const articleId = req.params.articleId;
    const resultArticleEditor = await ArticleEditor.findByIdAndUpdate(
        articleId,
        articleInfo,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    // find article status and update
    const articleDataId = resultArticleEditor.article_data_id;
    const resultArticleEditorData = await ArticleEditorData.findByIdAndUpdate(
        articleDataId,
        articleDataInfo,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Article editor updated!',
            data: { resultArticleEditor, resultArticleEditorData },
            accessToken: req.token,
        })
    );
});

// assign editors to specific article
exports.assignEditor = catchAsync(async (req, res) => {
    const editorList = req.body.editorList;
    const article = await ArticleEditor.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    for (var editor in editorList) {
        article.editorList.addToSet(editorList[editor]);
    } // end for
    const result = await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Editor is assigned to article!',
            data: result,
            accessToken: req.token,
        })
    );
});

// unassign specific editors form specific article 
exports.unassignEditor = catchAsync(async (req, res) => {
    const editorListId = req.body.editorList;
    const article = await ArticleEditor.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const result = await article.updateOne(
        { $pull: { "editorList": { "email": editorListId.email } } },
        { multi: true }
    );

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Editor is unassigned from article!',
            data: result,
            accessToken: req.token,
        })
    );
});