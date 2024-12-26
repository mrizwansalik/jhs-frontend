// import models
const {ArticleStatus, articleStatusUpdateValidate, articleStatusValidate} = require('../../models/article/articleStatus');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all article Status
exports.getAllArticleStatus = factory.getAll(ArticleStatus);
exports.getAllArticleStatusWithParent = factory.getAll(ArticleStatus, "parentStatus");

// get specific article Status
exports.getArticleStatus = factory.getOne(ArticleStatus);
exports.getArticleStatusWithParent = factory.getOne(ArticleStatus, "parentStatus");

// add new articleStatus
exports.addArticleStatus = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r| )/gm, "");
    const type = req.body.type;
    const message = req.body.message;

    const data = {
        name: name,
        slug: slug,
        type: type,
        message: message,
    }

    // validate request body using Joi Validation define in Article Status Mongoes models
    const {error} = articleStatusValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // create new Article Status object
    const articleStatus = new ArticleStatus(data);
    // adding article Status in db using mongoes articleStatus Object
    const result = await articleStatus.save();

    // set response with article status and JWT token
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: "Article status information created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.updateArticleStatus = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r| )/gm, "");
    const type = req.body.type;
    const message = req.body.message;

    const data = {
        name: name,
        slug: slug,
        type: type,
        message: message,
    }

    // validate request body using Joi Validation define in ArticleStatus Mongoes models
    const {error} = articleStatusUpdateValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find article status and update
    const articleStatusId = req.params.articleStatusId;
    const result = await ArticleStatus.findByIdAndUpdate(
        articleStatusId,
        data,
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
            message: 'Article status information updated!',
            data: result,
            accessToken: req.token,
        })
    );
});