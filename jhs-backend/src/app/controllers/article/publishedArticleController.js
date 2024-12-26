// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const { promisify } = require('util');
const fs = require("fs");
const { join } = require('path');
const mv = promisify(fs.rename);

const APIFeatures = require('../../utils/apiFeatures');
const { getPublishedArticleObject } = require('../../helper/PublishedArticle');
const { ArticlePublished } = require('../../models/article/articlePublished');

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

    const article = await ArticlePublished.findById(req.params.id);
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
        req.params.id,
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
