var moment = require('moment');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');

const APIFeatures = require('../utils/apiFeatures');
const { getPublishedArticleObject } = require('../helper/PublishedArticle');
const { ArticlePublished } = require('../models/article/articlePublished');


require('@citation-js/plugin-enw');
require('@citation-js/plugin-refworks');
require('@citation-js/plugin-ris');
require('@citation-js/plugin-bibtex');
const Cite = require('citation-js');

const factory = require('./handleFactory');
const { ArticleType } = require('../models/article/articleType');
const { ArticlePublishedMetrics } = require('../models/article/articlePublishedMetrics');
const { makeReferenceTextFromList, getLocationFromCoordinates, groupByCountryViewsAndDownloads, convertRegionValue, groupByDate, groupBySaudiRegionViewsAndDownloads, groupByUAERegionViewsAndDownloads, groupByQatarRegionViewsAndDownloads, groupByOmanRegionViewsAndDownloads, groupByKuwaitRegionViewsAndDownloads, groupByBahrainRegionViewsAndDownloads } = require('../utils/helperFunction');
const { Category } = require('../models/category');
const { User } = require('../models/user');

// get all article Status
exports.getPublicArticleType = factory.getAll(ArticleType);
exports.getPublicAuthor = factory.getAll(User);

// get all article Status
exports.getCurrentIssuesArticles = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    let query = ArticlePublished.find().populate(["_author", "journal_info"]);

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
exports.getTrendingCategoriesList = catchAsync(async (req, res) => {

    const topCategories = await Category.aggregate([
        {
            $sort: { no_of_publications: -1 } // Sort categories by 'views' in descending order (-1 means highest first)
        },
        {
            $limit: 10 // Limit the result to the top 5 categories
        },
        {
            $project: { _id: 1, name: 1, no_of_publications: 1 }
        }
    ]);

    res.status(200).json(
        Response.success({
            message: 'Success',
            status: 200,
            data: topCategories,
            accessToken: req.token,
        })
    );
});

// get all article Status
exports.getArticleList = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };
    const { article_keyword, type, article_category } = req.query;

    // Initialize an empty query object
    let query = {};

    // Handle `article_keyword` for title, keywords, category, and doi
    if (article_keyword) {
        query.$or = [
            { articleNumber: { $regex: article_keyword, $options: 'i' } },   // Partial and case-insensitive
            { title: { $regex: article_keyword, $options: 'i' } },           // Partial and case-insensitive
            { type: { $regex: article_keyword, $options: 'i' } },            // Partial and case-insensitive
            { abstract: { $regex: article_keyword, $options: 'i' } },        // Partial and case-insensitive
            { keywords: { $in: [article_keyword] } },                        // Check if `article_keyword` matches any keyword
            { doi: { $regex: article_keyword, $options: 'i' } },             // Partial match for DOI]
            { "_author.full_name": { $regex: article_keyword, $options: 'i' } }, // Match author's first name
            { "_author.email": { $regex: article_keyword, $options: 'i' } }      // Match author's email
        ];
    }
    // add author , year or publish date

    if (type) {
        query.type = type;
    }

    // Fix for `article_category` filter
    if (article_category) {
        query.category = {
            $in: Array.isArray(article_category) ? article_category : [article_category]
        };
    }

    let dataResult = ArticlePublished.find(query).populate([
        "_author",
        "journal_info",
        "articleMatrices_data_id",
        "category"
    ]);

    const features = new APIFeatures(dataResult, req.query)
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

exports.getTrendingKeywords = catchAsync(async (req, res) => {
    const currentDate = new Date();

    const trendingKeywords = await ArticlePublished.aggregate([
        {
            $addFields: {
                daysSincePublished: {
                    $divide: [
                        { $subtract: [currentDate, "$publishedDate"] },
                        1000 * 60 * 60 * 24 // Convert milliseconds to days
                    ]
                }
            }
        },
        {
            $addFields: {
                trendingScore: {
                    $add: [
                        { $multiply: ["$views", 0.5] },
                        { $multiply: ["$downloads", 0.3] },
                        { $multiply: [{ $divide: [1, { $add: ["$daysSincePublished", 1] }] }, 0.2] }
                    ]
                }
            }
        },
        { $unwind: "$keywords" }, // Unwind keywords array to aggregate by each keyword
        {
            $group: {
                _id: "$keywords", // Group by each keyword
                totalTrendingScore: { $sum: "$trendingScore" },
                count: { $sum: 1 } // Optional: count articles for each keyword
            }
        },
        { $sort: { totalTrendingScore: -1 } },
        { $limit: 10 } // Top 10 trending keywords
    ]);

    res.status(200).json(
        Response.success({
            message: 'Article found',
            status: 200,
            data: trendingKeywords,
            accessToken: req.token,
        })
    );
});

// get specific article Status
exports.getArticle = catchAsync(async (req, res) => {
    const article = await getPublishedArticleObject('', req.userId);
    let doc = await article.getArticle(req.params.id, req.userId)

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article found',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

exports.exportCitation = catchAsync(async (req, res) => {

    var citationType = req.body.type;
    if (!(['enw', 'ris', 'bibtex', 'refworks']).includes(citationType)) {
        return res.status(404).json(
            Response.notFound({ message: `Invalid citation` })
        );
    }

    let extensions;
    switch (citationType) {
        case 'enw':
            extensions = 'enw';
            break;
        case 'ris':
            extensions = 'ris';
            break;
        case 'bibtex':
            extensions = 'bibtex';
            break;
        case 'refworks':
            extensions = 'txt';
            break;
    }

    var articleId = req.params.id;
    let article = await ArticlePublished.findOne({
        _id: articleId,
    }).populate(["authorList", "_author", "journal_info"]);
    if (!article) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    var authors = article?.authorList.map((item, index) => {
        return {
            family: item?.full_name ?? `Untitled Name ${index}`,
        }
    });

    const data = await Cite.async({
        id: `${article?.articleNumber ?? 'JOHS'}`,
        "citation-key": `${article?.articleNumber ?? 'JOHS'}`,
        author: [
            { family: authors?._author?.full_name ?? "Untitled Name" },
            ...authors
        ],
        page: `${article?.page ?? "-"}`,
        volume: `${article?.volume ?? 0}`,
        issue: `${article?.issue ?? 0}`,
        year: `${moment(article?.submittedAt).format('YYYY') ?? 0}`,
        'container-title': 'Journal of Healthcare Sciences',
        title: `${article?.title}`,
        abstract: `${article?.abstract}`,
        keyword: `${article?.keywords.toString()}`,
        issued: {
            'date-parts': [[
                moment(article?.submittedAt).format('YYYY'),
                moment(article?.submittedAt).format('MM'),
                moment(article?.submittedAt).format('DD')
            ]]
        },
        type: 'article-journal',
        DOI: `${article?.doi}`,
        URL: `${article?.doi}`
    });

    var citation = data.format(citationType, { format: 'text', lineEnding: '\n' })

    res.status(200).json(
        Response.success({
            message: 'Citation Exported',
            status: 200,
            data: { citation, "citationType": extensions },
            accessToken: req.token,
        })
    );
});

// get specific article Author
exports.getPublishedArticleAuthors = catchAsync(async (req, res) => {

    const article = await getPublishedArticleObject('', req.userId);
    let doc = await article.getArticleAuthorInfo(req.params.id, req.userId)

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article Author Information',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

// get specific article Reviewer
exports.getPublishedArticleReviewers = catchAsync(async (req, res) => {

    const article = await getPublishedArticleObject('', req.userId);
    let doc = await article.getArticleReviewerInfo(req.params.id, req.userId)

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article Reviewer Information',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

// get specific article References Text
exports.getPublishedArticleReferencesTextList = catchAsync(async (req, res) => {

    const article = await getPublishedArticleObject('', req.userId);
    let doc = await article.getPublishedArticleReferencesTextList(req.params.id);

    var referenceText = await makeReferenceTextFromList(doc);

    res.status(200).json(
        Response.success({
            message: 'Article References List Found',
            status: 200,
            data: referenceText,
            accessToken: req.token,
        })
    );
});

exports.getPublishedArticleDetail = catchAsync(async (req, res) => {

    let doc = await ArticlePublished.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } }, // Increment viewsCount by 1
        { new: true }
    ).populate([
            "articlePublished_data_id", "journal_info", "articleMatrices_data_id",
            {
                path: 'articlePublished_data_id', // Populate the `rating` field in publish article schema
            },
            {
                path: 'journal_info', // Populate the `rating` field in publish article schema
            },
            {
                path: 'rating', // Populate the `rating` field in publish article schema
                model: 'articleRating',
                populate: [
                    {
                        path: 'rater_id',
                        model: 'user',
                    },
                    {
                        path: 'rating_list.rating_item', // Populate `rating_item` in `rating_list`
                        model: 'articleRatingList', // Reference the `articleRatingList` model
                    },
                ]
            }
        ]);
    
    let location = null;
    if (req.query.latitude) {
        location = await getLocationFromCoordinates(req.query.latitude, req.query.longitude);
    }

    if (doc?.articleMatrices_data_id == undefined) {
        // create new Article Data object
        const articlePublishedMatrices = new ArticlePublishedMetrics();
        // adding article data in db using mongoes article Object
        const resultArticlePublishedMatricesData = await articlePublishedMatrices.save();

        const data = {
            articleMatrices_data_id: resultArticlePublishedMatricesData._id.toString()
        }

        doc.set(data);
        doc = await (await doc.save()).populate(["articlePublished_data_id", "journal_info", "articleMatrices_data_id"]);
    }

    let result = await ArticlePublishedMetrics.findById(doc.articleMatrices_data_id);
    if (req.query.latitude) {
        const viewData = {
            code: convertRegionValue(location?.address ? location?.address['ISO3166-2-lvl4'] : 'other'),
            country: location?.address?.country ?? 'other',
            region: location?.address?.state ?? 'other',
            deviceId: req.headers['info-device-id'] ?? 'other',
        }
        result.viewsInfo.addToSet(viewData);
    } else {
        result.viewsInfo.addToSet({
            deviceId: req.headers['info-device-id'] ?? 'other',
        });
    }
    await result.save();

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article found',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

exports.getPublishedArticleMatrices = catchAsync(async (req, res) => {

    let doc = await ArticlePublished.findById(req.params.id).populate(["articleMatrices_data_id"]);

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    const countryMatrices = groupByCountryViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const saudiRegionMatrices = groupBySaudiRegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const uaeRegionMatrices = groupByUAERegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const qatarRegionMatrices = groupByQatarRegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const omanRegionMatrices = groupByOmanRegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const kuwaitRegionMatrices = groupByKuwaitRegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const bahrainRegionMatrices = groupByBahrainRegionViewsAndDownloads(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);
    const byDateMatrices = groupByDate(doc?.articleMatrices_data_id?.viewsInfo, doc?.articleMatrices_data_id?.downloadsInfo);


    res.status(200).json(
        Response.success({
            message: 'Article Matrices Information',
            status: 200,
            data: {
                totalViews: doc?.views,
                totalDownloads: doc?.downloads,
                byDateMatrices: byDateMatrices,
                countryMatrices: countryMatrices,
                saudiRegionMatrices: saudiRegionMatrices,
                uaeRegionMatrices: uaeRegionMatrices,
                qatarRegionMatrices: qatarRegionMatrices,
                omanRegionMatrices: omanRegionMatrices,
                kuwaitRegionMatrices: kuwaitRegionMatrices,
                bahrainRegionMatrices: bahrainRegionMatrices,
            },
            accessToken: req.token,
        })
    );
});

exports.downloadPDF = catchAsync(async (req, res) => {

    let doc = await ArticlePublished.findByIdAndUpdate(
        req.params.id,
        { $inc: { downloads: 1 } }, // Increment viewsCount by 1
        { new: true }
    ).populate(["articleMatrices_data_id"]);

    let location = null;
    if (req.query.latitude) {
        location = await getLocationFromCoordinates(req.query.latitude, req.query.longitude);
    }

    let result = await ArticlePublishedMetrics.findById(doc.articleMatrices_data_id);

    if (req.query.latitude) {
        const viewData = {
            code: convertRegionValue(location?.address ? location?.address['ISO3166-2-lvl4'] : 'other'),
            country: location?.address?.country ?? 'other',
            region: location?.address?.state ?? 'other',
            deviceId: req.headers['info-device-id'] ?? 'other',
        }
        result.downloadsInfo.addToSet(viewData);
    } else {
        result.downloadsInfo.addToSet({
            deviceId: req.headers['info-device-id'] ?? 'other',
        });
    }
    await result.save();

    if (doc.pdf == "") return res.status(404).json(
        Response.notFound({ message: `No Article PDF found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article PDF File found',
            status: 200,
            data: {
                articleNumber: doc.articleNumber,
                pdf: doc.pdf
            },
            accessToken: req.token,
        })
    );
});

// get all article Status
exports.getPublicAuthorList = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };
    const { author_detail } = req.query;

    // Initialize an empty query object
    let query = {};

    // Handle `article_keyword` for title, keywords, category, and doi
    if (author_detail) {
        query.$or = [
            { full_name: { $regex: author_detail, $options: 'i' } },
            { email: { $regex: author_detail, $options: 'i' } },
            { department: { $regex: author_detail, $options: 'i' } },
            { occupation: { $regex: author_detail, $options: 'i' } },
            { institute: { $regex: author_detail, $options: 'i' } },
            { country: { $regex: author_detail, $options: 'i' } },
            { gender: { $regex: author_detail, $options: 'i' } },
        ];
    }

    let dataResult = User.find(query).populate(["userReport"]);

    const features = new APIFeatures(dataResult, req.query)
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

exports.getPublicSingleAuthor = catchAsync(async (req, res) => {

    let doc = await User.findById(req.params.id).populate(
        {
            path: 'userReport', // Populate the `userReport` field in User schema
            populate: [
                {
                    path: 'articles.published_list', // Populate `published_list` in userReport
                    model: 'articlePublished', // The model for the `published_list` field
                },
                {
                    path: 'articles.collaboration_list', // Populate `published_list` in userReport
                    model: 'articlePublished', // The model for the `published_list` field
                },
                {
                    path: 'articles.completed_reviewed_list', // Populate `published_list` in userReport
                    model: 'articlePublished', // The model for the `published_list` field
                },
            ]
        }
    );

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Author found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Author found',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});
