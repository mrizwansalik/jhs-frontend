// third party import
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const fs = require("fs");
const {join} = require('path');
const mv = promisify(fs.rename);

require('@citation-js/plugin-enw');
require('@citation-js/plugin-refworks');
require('@citation-js/plugin-ris');
require('@citation-js/plugin-bibtex');

const { v4: uuidv4 } = require('uuid');
const { Cite } = require('@citation-js/core')

//const Citation = require('citation');

// import modelsArticleStatus
const { Article, articleUpdateValidate, articleValidate } = require('../../models/article/article');
const { ArticleData, articleReferenceDataValidate, articleGenerateReferenceDataValidate, articleValidateAlreadyExist } = require('../../models/article/articleData');
const { ArticleType } = require('../../models/article/articleType')

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting, parseVancouverReferences, checkCitationSequence, checkTableSequence, checkFigureSequence, getExtension, makeReferenceTextFromList } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');

// import config information
const clientSecret = require("../../config/clientSecret.config");
const { ArticleStatus } = require('../../models/article/articleStatus');
const { ArticleHistory } = require('../../models/article/articleHistory');
const { getArticleObject } = require('../../helper/Article/index');
const APIFeatures = require('../../utils/apiFeatures');

const { generateInvoiceHTML } = require('../../utils/invoice/generateInvoiceHTML');
const { Invoice } = require('../../models/invoice/invoice');
const { User } = require('../../models/user');
const { Message } = require('../../models/chat/message');
const { ArticleComment } = require('../../models/article/articleComment');
const { ArticleDiscussion } = require('../../models/article/articleDiscussion');
const { addArticleStatusHistory, addArticleEditorHistory } = require('../../utils/article/history');
const { incrementReviewArticleOnAssigningReport, decreaseReviewArticleOnUnAssigningReport } = require('../../utils/article/changeUserReport');

// get all article Status
exports.getAllArticle = catchAsync(async (req, res) => {
    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getArticleObject('', req.userId);
    let query = article.getAllArticle(req.userId);

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

exports.getAllDraftArticle = catchAsync(async (req, res) => {

    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getArticleObject('', req.userId);
    let query = article.getAllDraftArticle(req.userId);

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
exports.getAllAssignedArticles = catchAsync(async (req, res) => {

    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getArticleObject('', req.userId);
    let query = article.getAllAssignedArticles(req.userId);

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
exports.getAllReviewerArticles = catchAsync(async (req, res) => {

    let filter = {};
    if (req.params.tourId) filter.tourId = { tour: req.params.tourId };

    const article = await getArticleObject('', req.userId);
    let query = article.getAllReviewerArticles(req.userId);

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
exports.exportCitation = catchAsync(async (req, res) => {

    var citationType = req.body.type;
    if (!(['enw', 'ris', 'bibtex', 'refworks']).includes(citationType)) {
        return res.status(404).json(
            Response.notFound({ message: `Invalid citation` })
        );
    }

    var articleId = req.params.id;
    let article = await Article.findOne({
        _id: articleId,
    }).populate(["authorList", "_author", "articleStatus"]);

    if (!article) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    var authors = article?.authorList.map((item, index) => {
        return {
            family: item?.full_name ?? `Untitle Name ${index}`,
        }
    });

    const data = await Cite.async({
        id: "JOHS2021000329",
        "citation-key": "JOHS2021000329",
        author: [
            { family: authors?._author?.full_name ?? "Untitle Name" },
            ...authors
        ],
        page: '210-214',
        volume: '3',
        issue: '7',
        year: '2023',
        'container-title': 'Journal of Healthcare Sciences',
        title: article?.title,
        abstract: article?.abstract,
        keyword: article?.keywords.toString(),
        issued: { 'date-parts': [[2023, 8, 12]] },
        type: 'article-journal',
        DOI: 'http://dx.doi.org/10.52533/JOHS.2023.30703',
        ISSN: '1658-8967',
        URL: 'http://johs.com.sa/#/pages/issue/abstract/173'
    });

    var citation = data.format(citationType, { format: 'text', lineEnding: '\n' })

    res.status(200).json(
        Response.success({
            message: 'Citation Exported',
            status: 200,
            data: citation,
            accessToken: req.token,
        })
    );
});


// accept specific article after submission
exports.createInvoice = catchAsync(async (req, res) => {
    const invoice = await Invoice.findById(req.params.invoiceId).populate(["client", 'payment']);
    if (!invoice) {
        // return with error of invoice not found in db
        return res.status(404).json(
            Response.notFound({ message: `Invoice with this id could not be found.` })
        );
    } // end if

    // Generate the invoice HTML using custom template
    const html = generateInvoiceHTML(invoice);

    // Send the response with the generated HTML
    res.send(html);
});
// get specific article Status
exports.getArticle = catchAsync(async (req, res) => {
    const article = await getArticleObject('', req.userId);
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

// get specific article Author
exports.getArticleAuthors = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
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
exports.getArticleReviewers = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
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
// get specific article Editor
exports.getArticleEditor = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
    let doc = await article.getArticleEditorInfo(req.params.id, req.userId)

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article Editor Information',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
});

exports.getArticleDetail = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
    let doc = await article.getArticleDetail(req.params.id, req.userId);

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

// get specific article References Text
exports.getArticleReferencesTextList = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
    let doc = await article.getArticleDetail(req.params.id, req.userId);

    var referenceText = await makeReferenceTextFromList(doc?.article_data_id?.reference)

    res.status(200).json(
        Response.success({
            message: 'Article References List Found',
            status: 200,
            data: referenceText,
            accessToken: req.token,
        })
    );
});

exports.getDraftArticleDetail = catchAsync(async (req, res) => {
    const result = await Article.findOne({
        $and: [
            { _id: req.params.id },
            { "_author": req.userId }
        ]
    }).populate(["authorList", "article_data_id", "articleMetaInfo", "articleStatus", "suggestedReviewerList", "category"]);

    if (!result) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article found',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// get specific article References Text
exports.getDraftArticleReferencesTextList = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
    let doc = await article.getArticleDetail(req.params.id, req.userId);

    var referenceText = await makeReferenceTextFromList(doc?.article_data_id?.reference)

    res.status(200).json(
        Response.success({
            message: 'Article References List Found',
            status: 200,
            data: referenceText,
            accessToken: req.token,
        })
    );
});

exports.getArticleActionHistory = catchAsync(async (req, res) => {

    const article = await getArticleObject('', req.userId);
    let doc = await article.getArticleWithActionHistory(req.params.id, req.userId);


    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            message: 'Article found',
            status: 200,
            data: doc.history,
            accessToken: req.token,
        })
    );
});

// get start for creating new article
exports.getStarted = catchAsync(async (req, res) => {

    // create new Article Data object
    const articleData = new ArticleData();
    // adding article data in db using mongoes article Object
    const resultArticleData = await articleData.save();

    // create new Article Data object
    const articleDiscussion = new ArticleDiscussion();
    // adding article data in db using mongoes article Object
    const resultArticleDiscussion = await articleDiscussion.save();

    // create new Article Data object
    const articleHistory = new ArticleHistory();
    const resultArticleHistory = await articleHistory.save();

    const data = {
        article_data_id: resultArticleData._id.toString(),
        article_discussion_id: resultArticleDiscussion._id.toString(),
        history: resultArticleHistory._id.toString(),
        isDraft: true,
        type: req.body.type,
        _author: req.userId,
    }

    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = articleValidate(data);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // find user from db
    const checkArticleType = await ArticleType.findOne({ name: data.type });
    if (!checkArticleType) {
        return res.status(400).json(
            Response.error({ message: `Invalid Article Type` })
        );
    }

    // create new Article object
    const article = new Article(data);
    // adding article in db using mongoes article Object
    const result = await article.save();

    await addArticleStatusHistory(article.history, "Article Draft is created", "Draft", req.userId);

    // set response with article status and JWT token
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Article created!",
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.updateArticle = catchAsync(async (req, res) => {

    const articleInfo = {
        title: req.body.title,
        type: req.body.type,
        abstract: req.body.abstract,
        keywords: req.body.keywords,
        category: req.body.category,
        journal_info: req.body.journal_info,
        isDraft: req.body.isDraft,
        authorList: req.body.authorList
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

    const checkVerification = {
        isVerified: false,
    }

    // validate request body using Joi Validation define in Article Mongoes models
    const { error } = articleUpdateValidate({ ...articleInfo, ...articleDataInfo });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const articleId = req.params.articleId;

    const checkEditPermission = await Article.findById(articleId);
    if (checkEditPermission.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    // find article status and update
    const resultArticle = await Article.findByIdAndUpdate(
        articleId,
        { ...articleInfo, ...checkVerification },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    )

    const articleDataId = resultArticle.article_data_id;
    const resultArticleData = await ArticleData.findByIdAndUpdate(
        articleDataId,
        articleDataInfo,
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    const result = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Article updated!',
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific article status
exports.validateArticle = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    let warningMessages = [];
    let errorCheck = false;

    const articleType = await ArticleType.findOne({ name: article?.type })
    if (!articleType) {
        warningMessages.push({
            goto: 'title',
            type: 'Missing title',
            message: `Article Type is invalid`
        });
    } // end if

    if (article?.title === undefined || article?.title === "") {
        warningMessages.push({
            goto: 'title',
            type: 'Missing title',
            message: `Please add article title`
        });
    }

    if (article?.abstract === undefined || article?.abstract === "") {
        warningMessages.push({
            goto: 'abstract',
            type: 'Missing abstract',
            message: `Please add article abstract`
        });
    }

    if (article?.keywords === undefined) {
        warningMessages.push({
            goto: 'keyword',
            type: 'Missing keyword',
            message: `Please add article abstract`
        });
    }

    if (article?.keywords.length <= 2) {
        warningMessages.push({
            goto: 'keyword',
            type: 'Missing keyword',
            message: `Please add at-least 3 keywords`
        });
    }

    const requiredElement = articleType?.elements?.map((item) => { return item })
    for (let element of requiredElement) {
        if (article?.article_data_id[element] === undefined || article?.article_data_id[element] === "") {
            warningMessages.push({
                goto: element,
                type: `Missing ${element}`,
                message: `Please add article ${element}`
            });
        }
    }

    let tableTitleText;
    const tableTitle = article.article_data_id?.table_list;
    tableTitle.map((item, index) => {
        tableTitleText += item.title;
        tableTitleText += item.label ?? "";
        tableTitleText += item.data;
    });
    let figureTitleText;
    const figureTitle = article.article_data_id?.figures_list;
    figureTitle.map((item, index) => {
        figureTitleText += item.title;
        figureTitleText += item.label ?? "";
    });

    const articleData =
        article.article_data_id.introduction +
        article.article_data_id.conclusion +
        article.article_data_id.methodology +
        article.article_data_id.case_presentation +
        article.article_data_id.result +
        article.article_data_id.discussion +
        tableTitleText +
        figureTitleText;

    let checkCitationSequenceResponse = checkCitationSequence(articleData);
    if (checkCitationSequenceResponse.validation) {
        warningMessages.push({
            goto: 'introduction',
            type: 'Incorrect Citation Sequence',
            message: `Please add correct sequence of citation in article`
        })
    }

    errorCheck = false;
    if ((article.article_data_id.reference).length != checkCitationSequenceResponse?.citation.length) {
        // return with error of reference not match with citation
        errorCheck = true;
    } // end if
    if (errorCheck) {
        warningMessages.push({
            goto: 'reference',
            type: 'Incomplete Citation',
            message: `Reference list is incomplete, You must need ${checkCitationSequenceResponse?.citation.length} reference, but this article contain ${(article.article_data_id.reference).length} reference`
        }) 
    } // end if

    let referencesWarningMessages = []
    const references = article.article_data_id.reference;
    references.map((item, index) => {
        const { error } = articleValidateAlreadyExist(item);
        if (error) {
            referencesWarningMessages.push({
                goto: 'reference',
                type: 'Citation',
                message: `Reference ${++index} - Please review all article sections to determine correct placement.`,
                data: item,
                error: error,
            })
        } // end if
    })

    let checkTableSequenceResponse = checkTableSequence(articleData);
    if (checkTableSequenceResponse.validation) {
        warningMessages.push({
            goto: 'introduction',
            type: 'Incorrect Table Citation Sequence',
            message: `Please add correct sequence for table in article`
        })
    }

    errorCheck = false;
    if ((article.article_data_id.table_list).length != checkTableSequenceResponse?.tableCitation.length) {
        // return with error of table list not match with citation
        errorCheck = true;
    } // end if
    if (errorCheck) {
        warningMessages.push({
            goto: 'introduction',
            type: 'Incomplete Table Citation',
            message: `Table list is incomplete, You must need ${checkTableSequenceResponse?.tableCitation.length} table, but this article contain ${(article.article_data_id.table_list).length} table`
        })
    } // end if

    let checkFigureSequenceResponse = checkFigureSequence(articleData);
    if (checkFigureSequenceResponse.validation) {
        warningMessages.push({
            goto: 'introduction',
            type: 'Incorrect Figure Citation Sequence',
            message: `Please add correct sequence for figure in article`
        })
    }

    errorCheck = false;
    if ((article.article_data_id.figures_list).length != checkFigureSequenceResponse?.figureCitation.length) {
        // return with error of figures list not match with citation
        errorCheck = true;
    } // end if
    if (errorCheck) {
        warningMessages.push({
            goto: 'introduction',
            type: 'Incomplete Figure Citation',
            message: `Figure list is incomplete, You must need ${checkFigureSequenceResponse?.figureCitation.length} figure, but this article contain ${(article.article_data_id.figures_list).length} figure`
        })
    } // end if
    if (warningMessages.length != 0 || referencesWarningMessages.length != 0) {
        return res.status(422).json(
            Response.validation({
                status: 422,
                message: 'Validation Failed',
                data: {
                    errors: {
                        "warningMessages": warningMessages,
                        "referencesWarningMessages": referencesWarningMessages
                    }
                },
                accessToken: req.token,
            })
        );
    } // end if

    article.set({ isVerified: true });
    const resultArticle = await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Article verified!',
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// suggest Reference to specific article
exports.updateReferenceSorting = catchAsync(async (req, res) => {
    const reference = req.body.reference;

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article data not found.` })
        );
    } // end if

    const result = await ArticleData.findByIdAndUpdate(
        article.article_data_id,
        { reference: reference },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );
    
    article.set({ isVerified: false });
    await article.save();

    const resultArticle = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference updated!',
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// add reference to specific article
exports.addReference = catchAsync(async (req, res) => {
    const reference = req.body.reference;

    // validate request body using Joi Validation define in Article Mongoes models
    const { error } = articleReferenceDataValidate(reference);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    articleData.reference.addToSet(reference);
    const result = await articleData.save();

    
    article.set({ isVerified: false });
    await article.save();

    const articleResult = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference is assigned to article!',
            data: articleResult,
            accessToken: req.token,
        })
    );
});

// generate reference
exports.generateReference = catchAsync(async (req, res) => {

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    var referencesText = req.body.reference;

    const references = parseVancouverReferences(referencesText);

    for (let i = 0; i < references.length; i++) {
        articleData.reference.addToSet(references[i]);
        await articleData.save();

    } // end for

    article.set({ isVerified: false });
    await article.save();

    const articleResult = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference is assigned to article!',
            data: articleResult,
            accessToken: req.token,
        })
    );

});
// add reference to specific article
exports.launchReference = catchAsync(async (req, res) => {

    const articleResult = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference is assigned to article!',
            data: articleResult,
            accessToken: req.token,
        })
    );
});

// remove specific reference form specific article 
exports.removeReference = catchAsync(async (req, res) => {
    const referenceId = req.body.reference;
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if
    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const result = await article.article_data_id.updateOne(
        { $pull: { "reference": { "_id": referenceId } } },
        { multi: true }
    );

    article.set({ isVerified: false });
    await article.save();

    const articleResult = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference is removed from article!',
            data: articleResult,
            accessToken: req.token,
        })
    );
});

// get specific reference form specific article 
exports.getSpecificReference = catchAsync(async (req, res) => {
    const referenceId = req.params.reference;
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if
    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const result = article?.article_data_id?.reference?.find((reference) => reference._id == referenceId)

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference from article!',
            data: result,
            accessToken: req.token,
        })
    );
});
// update reference to specific article
exports.updateReference = catchAsync(async (req, res) => {
    const reference = req.body.reference;
    const articleReferenceID = req.body.referenceId;

    // validate request body using Joi Validation define in Article Mongoes models
    const { error } = articleReferenceDataValidate(reference);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const result = await ArticleData.findOneAndUpdate(
        { '_id': article.article_data_id, "reference._id": articleReferenceID },
        {
            $set: { "reference.$": reference }
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false,
        });

    
    article.set({ isVerified: false });
    await article.save();
        
    const articleResult = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reference is assigned to article!',
            data: articleResult,
            accessToken: req.token,
        })
    );
});

// add figure to specific article
exports.addFigure = catchAsync(async (req, res) => {
    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).json(
            Response.error({ message: "No files were uploaded." })
        );
    }

    let file = req.file;
    if (file['mimetype'].split('/')[0] !== 'image') {
        res.status(200).json({
            uploaded: false,
        });
    }

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    

    let uploadPath = __dirname + "/../../../../public/uploads/article/" + article._id;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, true);
    }

    // Move file
    const original = join(__dirname, "/../../../../public/uploads/" + file.filename);
    const target = join(__dirname, "/../../../../public/uploads/article/" + article._id+ "/" + file.filename);
    await mv(original, target);

    let insertedId = null;
    const figure = {
        title: req.body.title,
        label: req.body.label,
        thumbnail_url: "/uploads/article/" + article._id + "/" + file.filename,
        medium_url: "/uploads/article/" + article._id + "/" + file.filename,
        picture_url: "/uploads/article/" + article._id + "/" + file.filename,
        xl_picture_url: "/uploads/article/" + article._id + "/" + file.filename,
    }

    if (req.body.position !== undefined && articleData.figures_list.length > req.body.position) {
        const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table
        articleData.figures_list.splice(indexToInsert, 0, figure);
    } else {
        const insertedData = articleData.figures_list.addToSet(figure);
        insertedId = insertedData[0]._id;
    }

    const result = await articleData.save();    

    article.set({ isVerified: false });
    await article.save();
        
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Figure is assigned to article!',
            data: { result: result, insertedId: insertedId },
            accessToken: req.token,
        })
    );
});
// add figure to specific article
exports.uploadFigure = catchAsync(async (req, res) => {
    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).json(
            Response.error({ message: "No files were uploaded." })
        );
    }

    let file = req.file;
    if (file['mimetype'].split('/')[0] !== 'image') {
        res.status(200).json({
            uploaded: false,
        });
    }

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    let uploadPath = __dirname + "/../../../../public/uploads/article/" + article._id;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, true);
    }

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Figure is uploaded',
            data: { uploadPath: uploadPath },
            accessToken: req.token,
        })
    );
});

// add update to specific article
exports.updateFigure = catchAsync(async (req, res) => {

    if (!req.file || Object.keys(req.file).length === 0) {
        return res.status(400).json(
            Response.error({ message: "No files were uploaded." })
        );
    }

    let file = req.file;
    if (file['mimetype'].split('/')[0] !== 'image') {
        res.status(200).json({
            uploaded: false,
        });
    }

    const articleFigureId = req.body.figureId;

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    }

    if (!articleData.figures_list) {
        return res.status(404).json(
            Response.notFound({ message: 'Figure information not found.' })
        );
    }
    

    let uploadPath = __dirname + "/../../../../public/uploads/article/" + article._id;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, true);
    }

    // Move file
    const original = join(__dirname, "/../../../../public/uploads/" + file.filename);
    const target = join(__dirname, "/../../../../public/uploads/article/" + article._id+ "/" + file.filename);
    await mv(original, target);

    let result = null;

    if (req.body.position !== undefined && articleData.figures_list.length > req.body.position) {
        const figureIndex = articleData.figures_list.findIndex(figure => figure._id.equals(articleFigureId));
        if (figureIndex === -1) {
            return res.status(404).json({ message: 'Figure not found in the array.' });
        }

        // Update the fields of the figure
        req.body.title ? articleData.figures_list[figureIndex].title = req.body.title : '';
        req.body.label ? articleData.figures_list[figureIndex].label = req.body.label : '';
        articleData.figures_list[figureIndex].thumbnail_url = "/uploads/article/" + article._id + "/" + file.filename;
        articleData.figures_list[figureIndex].medium_url = "/uploads/article/" + article._id + "/" + file.filename;
        articleData.figures_list[figureIndex].picture_url = "/uploads/article/" + article._id + "/" + file.filename;
        articleData.figures_list[figureIndex].xl_picture_url = "/uploads/article/" + article._id + "/" + file.filename;

        const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the figure

        // Remove the element from its current position in the array
        const removedFigure = articleData.figures_list.splice(figureIndex, 1)[0];

        // Insert the element at the new position in the array
        articleData.figures_list.splice(indexToInsert, 0, removedFigure);

        // Save the updated articleData
        result = await articleData.save();
    } else {
        result = await ArticleData.findOneAndUpdate(
            { '_id': article.article_data_id, "figures_list._id": articleFigureId },
            {
                $set: {
                    "figures_list.$.title": req.body.title,
                    "figures_list.$.label": req.body.label ?? '',
                    "figures_list.$.thumbnail_url": "/uploads/article/" + article._id + "/" + file.filename,
                    "figures_list.$.medium_url":  "/uploads/article/" + article._id + "/" + file.filename,
                    "figures_list.$.picture_url": "/uploads/article/" + article._id + "/" + file.filename,
                    "figures_list.$.xl_picture_url": "/uploads/article/" + article._id + "/" + file.filename,
                }
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false,
            }
        );
    }

    article.set({ isVerified: false });
    await article.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Figure is assigned to article!',
            data: { result: result, updatedId: articleFigureId },
            accessToken: req.token,
        })
    );
});

// remove specific figure form specific article 
exports.removeFigure = catchAsync(async (req, res) => {
    const articleFigureID = req.body.articleFigureID;
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to remove figure while processing" })
        );
    }

    const result = await article.article_data_id.updateOne(
        { $pull: { "figures_list": { "_id": articleFigureID } } },
        { multi: true }
    );

    article.set({ isVerified: false });
    await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Figure is removed from article!',
            data: { result: result, deletedId: articleFigureID },
            accessToken: req.token,
        })
    );
});

// sort Figure to specific article
exports.updateFigureSorting = catchAsync(async (req, res) => {
    const figures_list = req.body.figures_list;

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article data not found.` })
        );
    } // end if

    const result = await ArticleData.findByIdAndUpdate(
        article.article_data_id,
        { figures_list: figures_list },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    article.set({ isVerified: false });
    await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Figure is updated!',
            data: result,
            accessToken: req.token,
        })
    );
});

// add table to specific article
exports.addTable = catchAsync(async (req, res) => {

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const table = {
        title: req.body.title,
        label: req.body.label,
        data: req.body.data,
        tableAssociated: req.body.tableAssociated,
    }
    let insertedId = null;

    if (req.body.position !== undefined && articleData.table_list.length > req.body.position) {
        const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table
        articleData.table_list.splice(indexToInsert, 0, table);
    } else {
        const insertedData = articleData.table_list.addToSet(table);
        insertedId = insertedData[0]._id;
    }

    const result = await articleData.save();

    article.set({ isVerified: false });
    await article.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Table is assigned to article!',
            data: { result: result, insertedId: insertedId },
            accessToken: req.token,
        })
    );
});

// add update to specific article
exports.updateTable = catchAsync(async (req, res) => {
    const articleTableId = req.body.tableId;

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    }

    if (!articleData.table_list) {
        return res.status(404).json(
            Response.notFound({ message: 'Table information not found.' })
        );
    }
    let result = null;

    if (req.body.position !== undefined && articleData.table_list.length > req.body.position) {
        const tableIndex = articleData.table_list.findIndex(table => table._id.equals(articleTableId));
        if (tableIndex === -1) {
            return res.status(404).json({ message: 'Table not found in the array.' });
        }

        // Update the fields of the table
        req.body.title ? articleData.table_list[tableIndex].title = req.body.title : '';
        req.body.label ? articleData.table_list[tableIndex].label = req.body.label : '';
        req.body.data ? articleData.table_list[tableIndex].data = req.body.data : '';
        req.body.data ? articleData.table_list[tableIndex].tableAssociated = req.body.tableAssociated : '';

        const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table

        // Remove the element from its current position in the array
        const removedTable = articleData.table_list.splice(tableIndex, 1)[0];

        // Insert the element at the new position in the array
        articleData.table_list.splice(indexToInsert, 0, removedTable);

        // Save the updated articleData
        result = await articleData.save();
    } else {
        result = await ArticleData.findOneAndUpdate(
            { '_id': article.article_data_id, "table_list._id": articleTableId },
            {
                $set: {
                    "table_list.$.title": req.body.title,
                    "table_list.$.label": req.body.label,
                    "table_list.$.data": req.body.data,
                    "table_list.$.tableAssociated": req.body.tableAssociated,
                }
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false,
            }
        );
    }

    article.set({ isVerified: false });
    await article.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Table is assigned to article!',
            data: { result: result, updatedId: articleTableId },
            accessToken: req.token,
        })
    );
});

// remove specific table form specific article 
exports.removeTable = catchAsync(async (req, res) => {
    const articleTableID = req.body.articleTableID;
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const result = await article.article_data_id.updateOne(
        { $pull: { "table_list": { "_id": articleTableID } } },
        { multi: true }
    );

    article.set({ isVerified: false });
    await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Table is removed from article!',
            data: { result: result, deletedId: articleTableID },
            accessToken: req.token,
        })
    );
});

// sort Table to specific article
exports.updateTableSorting = catchAsync(async (req, res) => {
    const table_list = req.body.table_list;

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article data not found.` })
        );
    } // end if

    const result = await ArticleData.findByIdAndUpdate(
        article.article_data_id,
        { table_list: table_list },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    article.set({ isVerified: false });
    await article.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Table is updated!',
            data: result,
            accessToken: req.token,
        })
    );
});
// update specific article status
exports.submitArticle = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if


    let articleStatus = await ArticleStatus.findOne({ name: "Submitted" });

    const articleInfo = {
        submittedAt: new Date(),
        isDraft: false,
        isEditable: false,
        isVerified: true,
        submitted: 1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == true) {
        article.set(articleInfo);
        resultArticle = await article.save();
    } else {
        // return with error of article not found in db
        return res.status(403).json(
            Response.notFound({ message: 'Please verify article to submit.' })
        );
    } // end else

    await addArticleStatusHistory(article.history, articleStatus.message, "Submitted", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Article submitted!',
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// assign author to specific article
exports.assignAuthor = catchAsync(async (req, res) => {
    const authorList = req.body.authorList;
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    for (var author in authorList) {
        if (article._author != authorList[author]._id) {

            const reviewer = article.suggestedReviewerList;
            if (!reviewer.includes(authorList[author]._id)) {
                article.authorList.addToSet(authorList[author]);
            } else {
                return res.status(403).json(
                    Response.forbidden({ message: `Author is already a reviewer of this article` })
                );
            }
        }
    } // end for
    let result = await article.save();

    result = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Author is assigned to article!',
            data: result,
            accessToken: req.token,
        })
    );
});

// unassign specific author form specific article 
exports.unassignAuthor = catchAsync(async (req, res) => {
    const authorListId = req.body.authorList;
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    let result = await article.updateOne(
        { $pull: { "authorList": authorListId[0]._id } },
        { multi: true }
    );

    result = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Author is unassigned from article!',
            data: result,
            accessToken: req.token,
        })
    );
});

// assign Reviewer to specific article
exports.assignReviewer = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
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

    let reviewerList = article.reviewerList;
    let authorList = article.authorList;
    let editorList = article.editors;

    let users = reviewerList.concat(authorList);
    users = users.concat(editorList);
    users.push(article._author);

    if (!users.includes(editorId)) {
        article.reviewerList.addToSet(editor);
        await article.save();

        const articleObj = await getArticleObject('', req.userId);
        let doc = await articleObj.getArticleDetail(req.params.articleId, req.userId)
        
        await incrementReviewArticleOnAssigningReport(editorId, req.params.articleId);

        await addArticleEditorHistory(article.history, "Assigned reviewer to article", req.userId, editorId);
        // send success response
        res.status(200).json(
            Response.success({
                status: 200,
                message: 'Reviewer is assigned to article!',
                data: doc,
                accessToken: req.token,
            })
        );
    } else {
        // return with error of reviewer is already a part of this article
        return res.status(404).json(
            Response.notFound({ message: `Can't assign this user to article` })
        );
    }
});

// unassign specific Reviewer form specific article 
exports.unassignReviewer = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
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

    let reviewerList = article.reviewerList;

    if (reviewerList.includes(editorId)) {

        let result = await article.updateOne(
            { $pull: { "reviewerList": editorId } },
            { multi: true }
        );

        const articleObj = await getArticleObject('', req.userId);
        let doc = await articleObj.getArticleDetail(req.params.articleId, req.userId)
        
        await decreaseReviewArticleOnUnAssigningReport(editorId, req.params.articleId);

        await addArticleEditorHistory(article.history, "Removed reviewer from article", req.userId, editorId);
        // send success response
        res.status(200).json(
            Response.success({
                status: 200,
                message: 'Reviewer removed from article!',
                data: doc,
                accessToken: req.token,
            })
        );
    } else {
        // return with error of reviewer not found in db
        return res.status(404).json(
            Response.notFound({ message: `Can't find this reviewer in article` })
        );
    }
});

// suggest Reviewer to specific article
exports.suggestReviewer = catchAsync(async (req, res) => {
    const reviewer = req.body.reviewer;
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    let suggestReviewer = reviewer[0]._id;

    const author = article.authorList;
    if (!author.includes(suggestReviewer) && suggestReviewer != article._author) {
        article.suggestedReviewerList.addToSet(reviewer[0]);
    } else {
        return res.status(403).json(
            Response.forbidden({ message: `Author of this article can't be reviewer` })
        );
    }

    let result = await article.save();
    result = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reviewer suggested to article!',
            data: result,
            accessToken: req.token,
        })
    );
});

// unSuggest specific Reviewer form specific article 
exports.unSuggestReviewer = catchAsync(async (req, res) => {
    const reviewer = req.body.reviewer;
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    if (article.isEditable !== true) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    let result = await article.updateOne(
        { $pull: { "suggestedReviewerList": reviewer[0]._id } },
        { multi: true }
    );

    result = await Article.findById(req.params.articleId).populate(["authorList", "article_data_id", "_author", "suggestedReviewerList"]);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Reviewer is remove from article reviewer suggestion list!',
            data: result,
            accessToken: req.token,
        })
    );
});

// delete specific Article 
exports.deleteMyArticle = catchAsync(async (req, res) => {
    const articleId = req.params.articleId;

    const article = await Article.findById(articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: `Article with this id could not be found.` })
        );
    } // end if

    const token = req.get('Authorization').split(' ')[1];
    let decodedToken = jwt.verify(token, clientSecret.key);
    const userId = decodedToken.userId;

    if (article._author == userId && article.authorList.includes(userId)) {
        // return with error of article not found in db
        return res.status(403).json(
            Response.forbidden({ message: `Your are not allowed to delete this article` })
        );
    } // end if

    if (!article.isDraft) {
        // return with error of article not in draft
        return res.status(403).json(
            Response.forbidden({ message: `You can only delete draft` })
        );
    } // end if

    const articleData = await ArticleData.findById(article.article_data_id);

    const articleHistory = await ArticleHistory.findById(article.history);

    // delete article history
    const articleHistoryResult = await articleHistory.delete();

    // delete article
    const articleDataResult = await articleData.delete();
    const result = await article.delete();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Article deleted!',
            data: { result, articleDataResult },
            accessToken: req.token,
        })
    );
});

exports.commentAttachments = catchAsync(async (req, res) => {
    var fileExtension = getExtension(req.body.file);
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
    var fileType = extensions.includes(fileExtension) ? "image" : "file";

    let uuid = uuidv4();
    const articleInfo = await Article.findById(req.body.articleId);
    const commentInfo = await ArticleComment.findById(req.body.commentId).populate([`${req.body.type}`]);

    const data = {
        message: req.body.file,
        chatusers: [...articleInfo.authorList],
        sender:  req.userId,
        uuid: uuid,
        type: fileType,
        belongsTo: 'comment',
    };
    const messageInfo = await Message.create(data);
    commentInfo[`${req.body.type}`].addToSet(messageInfo._id);
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

exports.discussionAttachments = catchAsync(async (req, res) => {
    var fileExtension = getExtension(req.body.file);
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
    var fileType = extensions.includes(fileExtension) ? "image" : "file";

    let uuid = uuidv4();
    const articleInfo = await Article.findById(req.body.articleId);
    const discussionInfo = await ArticleDiscussion.findById(articleInfo.article_discussion_id).populate([`${req.body.type}`]);

    const data = {
        message: req.body.file,
        chatusers: [...articleInfo.authorList],
        sender:  req.userId,
        uuid: uuid,
        type: fileType,
        belongsTo: 'discussion',
    };
    const messageInfo = await Message.create(data);
    discussionInfo[`${req.body.type}`].addToSet(messageInfo._id);
    discussionInfo.save();

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