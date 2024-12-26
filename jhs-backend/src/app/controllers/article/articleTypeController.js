// import models
const {ArticleType, articleTypeUpdateValidate, articleTypeValidate} = require('../../models/article/articleType');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all article Status
exports.getAllArticleType = factory.getAll(ArticleType);

// get specific article Status
exports.getArticleType = factory.getOne(ArticleType);

// add new articleType
exports.addArticleType = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const elements = req.body.elements;

    const data = {
        name: name,
        elements: elements,
    }

    // validate request body using Joi Validation define in Article Type Mongoes models
    const {error} = articleTypeValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // create new Article Type object
    const articleType = new ArticleType(data);
    // adding article Status in db using mongoes articleType Object
    const result = await articleType.save();

    // set response with article status and JWT token
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: "Article type information created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.updateArticleType = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const elements = req.body.elements;

    const data = {
        name: name,
        elements: elements,
    }

    // validate request body using Joi Validation define in ArticleType Mongoes models
    const {error} = articleTypeUpdateValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find article status and update
    const articleTypeId = req.params.articleTypeId;
    const result = await ArticleType.findByIdAndUpdate(
        articleTypeId,
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
            message: 'Article type information updated!',
            data: result,
            accessToken: req.token,
        })
    );
});
