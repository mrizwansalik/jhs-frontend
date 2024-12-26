



// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const { promisify } = require('util');
const fs = require("fs");
const { join } = require('path');
const mv = promisify(fs.rename);
const { validateErrorFormatting } = require('../../utils/helperFunction');

const APIFeatures = require('../../utils/apiFeatures');
const { getPublishedArticleObject } = require('../../helper/PublishedArticle');
const { ArticlePublished } = require('../../models/article/articlePublished');

const { addPublicationRating, addEditorRating, addReviewRating, addArticleRating } = require('../../utils/article/manageUserRatingReport');
const { publicationRatingValidate } = require('../../models/rating/publicationRating');
const { reviewRatingValidate } = require('../../models/rating/reviewRating');

// get all article Status
exports.getMyPublishedArticle = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getPublishedArticleObject('', req.userId);
    let query = article.getPublishedArticle(req.userId);

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
            pagination: features.query.paginated,
            accessToken: req.token,
        })
    );
});
// upload PDF in specific article
exports.uploadArticlePDF = catchAsync(async (req, res) => {
    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).json(
            Response.error({ message: "No files were uploaded." })
        );
    }

    let file = req.file;
    if (file['mimetype'].split('/')[1] !== 'pdf') {
        res.status(200).json({
            uploaded: false,
        });
    }

    const article = await ArticlePublished.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleOldFile = article?.pdf;

    let uploadPath = __dirname + "/../../../../public/uploads/publications/" + article._id;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, true);
    }

    // Move file
    const original = join(__dirname, "/../../../../public/uploads/" + file.filename);
    const target = join(__dirname, "/../../../../public/uploads/publications/" + article._id + "/" + file.filename);
    await mv(original, target);

    const data = {
        pdf: "/uploads/publications/" + article._id + "/" + file.filename,
        page: req.body.pages,
    }

    // find article and update
    await ArticlePublished.findByIdAndUpdate(
        req.params.articleId,
        { ...data },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    )

    if (articleOldFile != null) {
        fs.unlink(join(__dirname, "/../../../../public" + articleOldFile), () => { });
    }

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'PDF is uploaded',
            data: { uploadPath: uploadPath },
            accessToken: req.token,
        })
    );
});

exports.addPublisherRating = catchAsync(async (req, res) => {

    const data = {
        user_id: req.body.user_id,
        article_id: req.params.articleId,
        rater_id: req.userId,
        score: req.body.score,
        comment: req.body.comment,
    }

    // validate request body using Joi Validation define in Mongoes models
    const { error } = publicationRatingValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    if(req.body.type == "Review"){
        await addReviewRating(data);
    } else if (req.body.type == "Editor"){
        await addEditorRating(data);
    }

    // send success response
    res.status(200).json(
        Response.success({
            message: 'Author Rating',
            status: 200,
            data: 'Article Rating is added',
            accessToken: req.token,
        })
    );
});
exports.addReviewerRating = catchAsync(async (req, res) => {

    const data = {
        user_id: req.body.user_id,
        article_id: req.params.articleId,
        rater_id: req.userId,
        score: req.body.score,
        comment: req.body.comment,
    }

    // validate request body using Joi Validation define in Mongoes models
    const { error } = publicationRatingValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    if(req.body.type == "Author"){
        await addPublicationRating(data);
    } else if (req.body.type == "Editor"){
        await addEditorRating(data);
    }

    // send success response
    res.status(200).json(
        Response.success({
            message: 'Reviewer Rating',
            status: 200,
            data: 'Reviewer Rating is added',
            accessToken: req.token,
        })
    );
});
exports.addEditorRating = catchAsync(async (req, res) => {

    const data = {
        user_id: req.body.user_id,
        article_id: req.params.articleId,
        rater_id: req.userId,
        score: req.body.score,
        comment: req.body.comment,
    }

    // validate request body using Joi Validation define in Mongoes models
    const { error } = publicationRatingValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    if(req.body.type == "Author"){
        await addPublicationRating(data);
    } else if (req.body.type == "Review"){
        await addReviewRating(data);
    }

    // send success response
    res.status(200).json(
        Response.success({
            message: 'Editor Rating',
            status: 200,
            data: 'Editor Rating is added',
            accessToken: req.token,
        })
    );
});
exports.addArticleRating = catchAsync(async (req, res) => {
    const data = {
        article_id: req.params.articleId,
        rater_id: req.userId,
        score: req.body.score,
        comment: req.body.comment,
    }

    // validate request body using Joi Validation define in Mongoes models
    const { error } = reviewRatingValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // add publication rating
    const result = await addArticleRating(data);

    // send success response
    res.status(200).json(
        Response.success({
            message: 'Review Rating',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});
