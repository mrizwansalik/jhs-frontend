// import models
const { ArticleRatingList, articleRatingListValidate, articleRatingListUpdateValidate } = require('../models/rating/articleRatingList');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { validateErrorFormatting } = require('../utils/helperFunction');
const { Response } = require('../../framework');
const factory = require('./handleFactory');

// get all categories 
exports.getAllArticleRatingList = factory.getAll(ArticleRatingList);

// get specific categories 
exports.getArticleRatingList = factory.getOne(ArticleRatingList);
exports.getByArticleRatingListName = factory.getByFiled(ArticleRatingList, "name");

// add new articleRatingList
exports.addArticleRatingList = catchAsync(async (req, res, next) => {
    const body = req.body;
    // validate request body using Joi Validation define in ArticleRatingList Mongoes models
    const {error} = articleRatingListValidate(body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    }
    // create new ArticleRatingList object
    const articleRatingList = new ArticleRatingList(body);
    // adding articleRatingList in db using mongoes articleRatingList Object
    const result = await articleRatingList.save();

    // set response with articleRatingList and JWT token
    res.status(200).json(
        Response.success({ 
            message: "Article Rating Item created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific articleRatingList
exports.updateArticleRatingList = catchAsync(async (req, res, next) => {
    // validate request body using Joi Validation define in ArticleRatingList Mongoes models
    const {error} = articleRatingListUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find articleRatingList and update
    const articleRatingListId = req.params.articleRatingListId;
    const result = await ArticleRatingList.findByIdAndUpdate(
        articleRatingListId,
        req.body,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    // send success response
    res.status(200).json(
        Response.success({ 
            message: 'Article Rating Item updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// deactivate specific articleRatingList
exports.deactivateArticleRatingList = catchAsync(async (req, res, next) => {
    const result = await ArticleRatingList.findByIdAndUpdate(
        req.params.id,
        {
            active: false,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Article Rating Item Deactivated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// activate specific articleRatingList
exports.activateArticleRatingList = catchAsync(async (req, res, next) => {
    const result = await ArticleRatingList.findByIdAndUpdate(
        req.params.id,
        {
            active: true,
        },
        {new: false, runValidators: true, returnOriginal: false}
    );
    res.status(200).json(
        Response.success({ 
            message: 'Article Rating Item Activated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});