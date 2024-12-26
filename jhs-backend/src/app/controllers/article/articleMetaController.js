// import models
const {ArticleMeta, articleMetaUpdateValidate, articleMetaValidate} = require('../../models/article/articleMeta');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');
const factory = require('../handleFactory');

// get all article Status
exports.getAllArticleMeta = factory.getAll(ArticleMeta);

// get specific article Status
exports.getArticleMeta = factory.getOne(ArticleMeta);

// add new articleMeta
exports.addArticleMeta = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r| )/gm, "");
    const volume = req.body.volume;
    const year = req.body.year;
    const issue = req.body.issue;

    const data = {
        name: name,
        slug: slug,
        volume: volume,
        year: year,
        issue: issue,
    }

    const articleMetaInfo = await ArticleMeta.findOne({
        year: year,
        issue: issue,
    });
    // validate request body using Joi Validation define in Article Meta Mongoes models
    const {error} = articleMetaValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    let result;
    if (!articleMetaInfo) {
        // create new Article Meta object
        const articleMeta = new ArticleMeta(data);
        // adding article Status in db using mongoes articleMeta Object
        result = await articleMeta.save();
    } else {
        result = await ArticleMeta.findByIdAndUpdate(
            articleMetaInfo._id,
            {
                name: name,
                slug: slug,
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
    } // end else

    // set response with article status and JWT token
    res.status(200).json(
        Response.success({ 
            status: 200,
            message: "Article meta information created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.updateArticleMeta = catchAsync(async (req, res, next) => {
    const name = req.body.name;
    const slug = name.replace(/(\r\n|\n|\r| )/gm, "");

    const data = {
        name: name,
        slug: slug,
    }

    // validate request body using Joi Validation define in ArticleMeta Mongoes models
    const {error} = articleMetaUpdateValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find article status and update
    const articleMetaId = req.params.articleMetaId;
    const result = await ArticleMeta.findByIdAndUpdate(
        articleMetaId,
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
            message: 'Article meta information updated!',
            data: result,
            accessToken: req.token,
        })
    );
});

