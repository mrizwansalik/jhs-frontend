// third party import
const { promisify } = require('util');
const fs = require("fs");
const { join } = require('path');
const mv = promisify(fs.rename);
var moment = require('moment');

// import modelsArticleStatus
const { Article } = require('../../models/article/article');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');

const { v4: uuidv4 } = require('uuid');

// import config information
const { ArticleComment, articleCommentValidate } = require('../../models/article/articleComment');
const { getArticleCommentObject } = require('../../helper/ArticleComment');
const { ArticleStatus } = require('../../models/article/articleStatus');
const { createArticleInvoice } = require("../../utils/invoice/createArticleInvoice");
const { setArticleMetaInfo } = require("../../utils/article/setArticleMetaInfo");
const { Message } = require("../../models/chat/message");
const { ArticleRevision } = require("../../models/article/articleRevision");
const { ArticleRevisionData } = require("../../models/article/articleRevisionData");
const { ArticleData } = require("../../models/article/articleData");
const { ArticleLanguageCorrectionData } = require("../../models/article/articleLanguageCorrectionData");
const { ArticleLanguageCorrection } = require("../../models/article/articleLanguageCorrection");
const { ArticlePublished } = require('../../models/article/articlePublished');
const { ArticlePublishedData } = require('../../models/article/articlePublishedData');
const { generateNextDoi } = require('../../utils/article/generateNextDoi');
const { ArticleDiscussion } = require('../../models/article/articleDiscussion');
const { ArticlePublishedMetrics } = require('../../models/article/articlePublishedMetrics');
const { addArticleStatusHistory } = require('../../utils/article/history');
const { Category } = require('../../models/category');
const { incrementPendingArticleReport, incrementRejectedArticleReport, incrementPublishedArticleReport, incrementPublishedCollaborationArticleReport, acceptRevisionArticleReport, incrementRevisionArticleReport, incrementCompleteReviewArticleReport } = require('../../utils/article/changeUserReport');
const { addPublicationRating, addEditorRating, addReviewRating } = require('../../utils/article/manageUserRatingReport');
const { publicationRatingValidate } = require('../../models/rating/publicationRating');
const { reviewRatingValidate } = require('../../models/rating/reviewRating');
const { editorRatingValidate } = require('../../models/rating/editorRating');

// accept specific article after submission
exports.acceptArticleOnSubmission = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in editor check.' })
        );
    }

    await setArticleMetaInfo(article);
    await createArticleInvoice(article);

    let articleStatus = await ArticleStatus.findOne({ slug: "pendingPayment" });

    const articleInfo = {
        acceptedAt: new Date(),
        isDraft: false,
        isEditable: false,
        isVerified: true,
        payment: -1,
        articleStatus: { "_id": articleStatus._id },
        isInvoiceCreated: 1,
    }

    article.set(articleInfo);
    const resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : ((req.body.processingText != '') ? req.body.processingText : "Article is accepted")), "Submission Approved", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Submission Approved",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
// accept specific article after submission
exports.payArticlePayment = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus;
    let articleInfo;
    if (article.languageCorrectionService == false) {
        articleStatus = await ArticleStatus.findOne({ slug: "languageCheck" });
        articleInfo = {
            payment: 1,
            status: -1,
            articleStatus: { "_id": articleStatus._id },
        }
    } else {
        articleStatus = await ArticleStatus.findOne({ slug: "pendingcorrectionservice" });
        articleInfo = {
            payment: 1,
            status: 0,
            articleStatus: { "_id": articleStatus._id },
        }
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in editor check.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await incrementPendingArticleReport(article._author, article._id);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Payment is done successfully"), "Payment Complete", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Payment Complete",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// move specific article for language correction
exports.requestArticleForLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "pendingcorrectionservice" });


    const articleInfo = {
        status: -1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in language check.' })
        );
    }

    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Author requested for language correction service"), "Requested For Language Correction Service", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Requested For Language Correction Service",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.acceptRequestForLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus;
    let articleInfo;

    if (article.languageCorrectionServiceInvoice == false) {
        await createArticleInvoice(article);
        articleStatus = await ArticleStatus.findOne({ slug: "pendingpayment" });
        articleInfo = {
            payment: -1,
            languageCorrectionService: true,
            languageCorrectionServiceInvoice: true,
            articleStatus: { "_id": articleStatus._id },
            isInvoiceCreated: 1,
        }
    } else {
        articleStatus = await ArticleStatus.findOne({ slug: "pendinglanguagecorrectionservice" });
        articleInfo = {
            status: 0,
            languageCorrectionService: true,
            languageCorrectionServiceInvoice: true,
            articleStatus: { "_id": articleStatus._id },
        }
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Language correction service request is accepted"), "Language Correction Request Accepted", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language correction service is accepted",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.completeLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "languagecheck" });

    const articleInfo = {
        payment: 1,
        languageCorrectionService: true,
        languageCorrectionServiceInvoice: true,
        status: -1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in language check.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Language correction is complete"), "Language Correction is Complete", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language correction is Complete",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

exports.startLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate(["article_data_id"]);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "languagecorrectionservice" });

    let resultArticle;
    if (article.status !== 0) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to accept language correction request at this time.' })
        );
    }

    // create new Article Data object
    const articleLanguageCorrectionData = new ArticleLanguageCorrectionData();
    // adding article data in db using mongoes article Object
    const resultArticleLanguageCorrectionData = await articleLanguageCorrectionData.save();

    const data = {
        title: article?.title,
        type: article?.type,
        keywords: article?.keywords,
        abstract: article?.abstract,
        category: article?.category,
        articleLanguageCorrection_data_id: resultArticleLanguageCorrectionData._id.toString(),
        article_id: resultArticleLanguageCorrectionData._id.toString(),
    }

    // create new Article object
    const articleLanguageCorrection = new ArticleLanguageCorrection(data);
    // adding article in db using mongoes article Object
    const result = await articleLanguageCorrection.save();

    const articleDataInfo = {
        introduction: article?.article_data_id?.introduction,
        methodology: article?.article_data_id?.methodology,
        result: article?.article_data_id?.result,
        case_presentation: article?.article_data_id?.case_presentation,
        discussion: article?.article_data_id?.discussion,
        conclusion: article?.article_data_id?.conclusion,
        acknowledgement: article?.article_data_id?.acknowledgement,
        disclosure: article?.article_data_id?.disclosure,
        supplementary: article?.article_data_id?.supplementary,
        table_list: article?.article_data_id?.table_list,
        figures_list: article?.article_data_id?.figures_list,
        videos_list: article?.article_data_id?.videos_list,
        reference: article?.article_data_id?.reference,
    }

    articleLanguageCorrectionData.set(articleDataInfo);
    await articleLanguageCorrectionData.save();

    const articleInfo = {
        status: -1,
        isEditable: 1,
        isVerified: 0,
        articleStatus: { "_id": articleStatus._id },
        article_languageCorrection_id: { "_id": articleLanguageCorrection._id },
    }
    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);
    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article language correction is in Process"), "Language Correction Processed", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language Correction Processed",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

exports.acceptArticleLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
    if (!articleLanguageCorrection) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article Language Correction with this id could not be found.' })
        );
    } // end if

    const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
    if (!articleData) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article Language Correction with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "languagecheck" });

    let resultArticle;
    if (article.status !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to accept language Correction at this time.' })
        );
    }

    const data = {
        title: articleLanguageCorrection?.title,
        keywords: articleLanguageCorrection?.keywords,
        abstract: articleLanguageCorrection?.abstract,

        status: -1,
        isEditable: 0,
        isVerified: 1,
        payment: 1,
        article_languageCorrection_id: null,

        articleStatus: { "_id": articleStatus._id },
    }

    const articleDataInfo = {
        introduction: articleLanguageCorrectionData?.introduction,
        methodology: articleLanguageCorrectionData?.methodology,
        result: articleLanguageCorrectionData?.result,
        case_presentation: articleLanguageCorrectionData?.case_presentation,
        discussion: articleLanguageCorrectionData?.discussion,
        conclusion: articleLanguageCorrectionData?.conclusion,
        acknowledgement: articleLanguageCorrectionData?.acknowledgement,
        disclosure: articleLanguageCorrectionData?.disclosure,
        supplementary: articleLanguageCorrectionData?.supplementary,
        table_list: articleLanguageCorrectionData?.table_list,
        figures_list: articleLanguageCorrectionData?.figures_list,
        videos_list: articleLanguageCorrectionData?.videos_list,
        reference: articleLanguageCorrectionData.reference,
    }

    articleData.set(articleDataInfo);
    await articleData.save();

    article.set(data);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article language correction is accepted"), "Language Correction Completed", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language Correction Completed",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.rejectArticleLanguageCorrection = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // let articleStatus = await ArticleStatus.findOne({ slug: "languagecorrectionservice" });

    const articleInfo = {
        status: -1,
    }

    let resultArticle;
    if (article.status !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to reject language Correction at this time.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article languageCorrection is rejected"), "Language Correction Rejected", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language Correction Rejected",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// request for revision
exports.requestForRevision = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "revisionrequest" });

    const articleInfo = {
        articleStatus: { "_id": articleStatus._id },
        status: -1,
        revised: (article?.revised + 1),
    }

    let resultArticle;
    if (article.status !== 0) {
        return res.status(422).json(
            Response.validation({ message: 'Revision request for article currently in progress are not permitted at this time.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Author requested for article revision"), "Revision Requested", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Revision Requested",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.approveRequestForRevision = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate(["article_data_id"]);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "inrevision" });

    let resultArticle;
    if (article.status !== -1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to accept revision request at this time.' })
        );
    }

    // create new Article Data object
    const articleRevisionData = new ArticleRevisionData();
    // adding article data in db using mongoes article Object
    const resultArticleRevisionData = await articleRevisionData.save();

    const data = {
        articleRevisionNumber: article?.articleNumber,
        journal_info: article?.journal_info,
        articleMetaInfo: article?.articleMetaInfo,
        title: article?.title,
        slug: article?.slug,
        type: article?.type,
        keywords: article?.keywords,
        abstract: article?.abstract,
        category: article?.category,
        articleRevision_data_id: resultArticleRevisionData._id.toString(),
        article_id: resultArticleRevisionData._id.toString(),
    }

    // create new Article object
    const articleRevision = new ArticleRevision(data);
    // adding article in db using mongoes article Object
    const result = await articleRevision.save();

    const articleDataInfo = {
        introduction: article?.article_data_id?.introduction,
        methodology: article?.article_data_id?.methodology,
        result: article?.article_data_id?.result,
        case_presentation: article?.article_data_id?.case_presentation,
        discussion: article?.article_data_id?.discussion,
        conclusion: article?.article_data_id?.conclusion,
        acknowledgement: article?.article_data_id?.acknowledgement,
        disclosure: article?.article_data_id?.disclosure,
        supplementary: article?.article_data_id?.supplementary,
        table_list: article?.article_data_id?.table_list,
        figures_list: article?.article_data_id?.figures_list,
        videos_list: article?.article_data_id?.videos_list,
        reference: article?.article_data_id?.reference,
    }

    articleRevisionData.set(articleDataInfo);
    await articleRevisionData.save();

    const articleInfo = {
        status: -1,
        isEditable: 1,
        isVerified: 0,
        articleStatus: { "_id": articleStatus._id },
        article_revision_id: { "_id": articleRevision._id },
    }
    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await incrementRevisionArticleReport(article._author, article._id);
    
    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Requested for article revision is accepted"), "Revision Request Approved", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Revision Request Approved",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.rejectRequestForRevision = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // let articleStatus = await ArticleStatus.findOne({ slug: "revisionrequest" });

    const articleInfo = {
        status: 0,
    }

    let resultArticle;
    if (article.status !== -1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to reject revision request at this time.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Requested for article revision is rejected"), "Revision Request Rejected", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Revision Request Rejected",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

exports.acceptArticleRevision = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleData = await ArticleData.findById(article.article_data_id);
    if (!articleData) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    const articleRevision = await ArticleRevision.findById(article.article_revision_id);
    if (!articleRevision) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article Revision with this id could not be found.' })
        );
    } // end if

    const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
    if (!articleData) {
        // return with error of article not found in db.
        return res.status(404).json(
            Response.notFound({ message: 'Article Revision with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "languagecheck" });

    let resultArticle;
    if (article.status !== -1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to accept revision at this time.' })
        );
    }

    const data = {
        articleRevisionNumber: articleRevision?.articleNumber,
        journal_info: articleRevision?.journal_info,
        articleMetaInfo: articleRevision?.articleMetaInfo,
        title: articleRevision?.title,
        slug: articleRevision?.slug,
        type: articleRevision?.type,
        keywords: articleRevision?.keywords,
        abstract: articleRevision?.abstract,
        category: articleRevision?.category,

        status: -1,
        isEditable: 0,
        isVerified: 1,
        article_revision_id: null,

        articleStatus: { "_id": articleStatus._id },
        revisedAt: new Date(),
    }

    const articleDataInfo = {
        introduction: articleRevisionData?.introduction,
        methodology: articleRevisionData?.methodology,
        result: articleRevisionData?.result,
        case_presentation: articleRevisionData?.case_presentation,
        discussion: articleRevisionData?.discussion,
        conclusion: articleRevisionData?.conclusion,
        acknowledgement: articleRevisionData?.acknowledgement,
        disclosure: articleRevisionData?.disclosure,
        supplementary: articleRevisionData?.supplementary,
        table_list: articleRevisionData?.table_list,
        figures_list: articleRevisionData?.figures_list,
        videos_list: articleRevisionData?.videos_list,
        reference: articleRevisionData.reference,
    }

    articleData.set(articleDataInfo);
    await articleData.save();

    article.set(data);
    resultArticle = await (await article.save()).populate(["articleStatus"]);
    
    await acceptRevisionArticleReport(article._author, article._id);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Requested for article revision is accepted"), "Revision Accepted", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Revision Accepted",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.rejectArticleRevision = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // let articleStatus = await ArticleStatus.findOne({ slug: "revisionsubmited" });

    const articleInfo = {
        status: 0,
        article_revision_id: null,
    }

    let resultArticle;
    if (article.status !== -1) {
        return res.status(422).json(
            Response.validation({ message: 'You not permitted to reject revision at this time.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);
    
    await incrementRejectedArticleReport(article._author, article._id);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article revision is rejected"), "Revision Rejected", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Revision Rejected",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// move specific article for language check
exports.moveArticleToLanguageCheck = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "languagecheck" });

    const articleInfo = {
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in language check.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }
    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : articleStatus.message), "In Language Check", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "In Language Check",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.acceptArticleFromLanguageCheck = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "peerreview" });
    const articleInfo = {
        status: -1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in language check.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article.' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Language check is accepted."), "Language Check Accepted", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language Check Accepted",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.rejectArticleFromLanguageCheck = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // let articleStatus = await ArticleStatus.findOne({ slug: "languagecheck" });

    const articleInfo = {
        status: 0,
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in language check.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article.' })
        );
    }
    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);
    
    await incrementRejectedArticleReport(article._author, article._id);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Language check is rejected."), "Language Check Rejected", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Language Check Rejected",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// move specific article for peer review check
exports.acceptArticleFromPeerReview = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if
    let articleStatus = await ArticleStatus.findOne({ slug: "galleryproofsend" });

    const articleInfo = {
        status: -1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in peer review.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Peer Review is accepted"), "Peer Review Accepted", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Peer Review Accepted",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});
exports.rejectArticleFromPeerReview = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // let articleStatus = await ArticleStatus.findOne({ slug: "peerreview" });

    const articleInfo = {
        status: 0,
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article to move it in peer review.' })
        );
    } // end if
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);
    
    await incrementRejectedArticleReport(article._author, article._id);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Peer Review is rejected"), "Peer Review Rejected", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Peer Review Rejected",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// move specific article for gallery proof
exports.acceptArticleFromGalleryProof = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId).populate("article_data_id");
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    let articleStatus = await ArticleStatus.findOne({ slug: "readyforpublish" });

    const articleInfo = {
        status: 1,
        articleStatus: { "_id": articleStatus._id },
    }

    let resultArticle;
    if (article.isVerified == false) {
        return res.status(422).json(
            Response.validation({ message: 'Please verify article for gallery proof.' })
        );
    }
    if (article.payment !== 1) {
        return res.status(422).json(
            Response.validation({ message: 'Please complete Payment to start processing on article' })
        );
    }

    article.set(articleInfo);
    resultArticle = await (await article.save()).populate(["articleStatus"]);

    await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article processing is complete"), "Proof Reading Complete", req.userId);

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Proof Reading Complete",
            data: resultArticle,
            accessToken: req.token,
        })
    );
});

// move specific article for gallery proof
exports.publishArticle = catchAsync(async (req, res) => {

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

    const article = await Article.findById(req.params.articleId).populate(["article_data_id", "articleMetaInfo"]);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    // create new Article Data object
    const articlePublishedData = new ArticlePublishedData();
    // adding article data in db using mongoes article Object
    const resultArticlePublishedDataData = await articlePublishedData.save();

    
    // create new Article Data object
    const articlePublishedMatrices = new ArticlePublishedMetrics();
    // adding article data in db using mongoes article Object
    const resultArticlePublishedMatricesData = await articlePublishedMatrices.save();

    const data = {
        articleNumber: article?.articleNumber,
        journal_info: article?.journal_info,
        doi: await generateNextDoi(article?.articleMetaInfo?.volume),
        volume: article?.articleMetaInfo?.volume,
        issue: article?.articleMetaInfo?.issue,

        title: article?.title,
        type: article?.type,
        keywords: article?.keywords,
        abstract: article?.abstract,
        category: article?.category,

        _author: article?._author,
        authorList: article?.authorList,
        reviewerList: article?.reviewerList,
        reviewerLog: article?.reviewerLog,
        managedBy: article?.managedBy,
        editors: article?.editors,
        
        articlePublished_data_id: resultArticlePublishedDataData._id.toString(),
        articleMatrices_data_id: resultArticlePublishedMatricesData._id.toString(),
        
        page: req.body.pages,

        submittedAt: article?.submittedAt,
        acceptedAt: article?.acceptedAt,
        revisedAt: article?.revisedAt,
        invoice: article?.invoice,
        publishedAt: new Date(),
    }

    // create new Article object
    const articlePublished = new ArticlePublished(data);
    // adding article in db using mongoes article Object
    const result = await articlePublished.save();

    const articleDataInfo = {
        introduction: article?.article_data_id?.introduction,
        methodology: article?.article_data_id?.methodology,
        result: article?.article_data_id?.result,
        case_presentation: article?.article_data_id?.case_presentation,
        discussion: article?.article_data_id?.discussion,
        conclusion: article?.article_data_id?.conclusion,
        acknowledgement: article?.article_data_id?.acknowledgement,
        disclosure: article?.article_data_id?.disclosure,
        supplementary: article?.article_data_id?.supplementary,
        table_list: article?.article_data_id?.table_list,
        figures_list: article?.article_data_id?.figures_list,
        videos_list: article?.article_data_id?.videos_list,
        reference: article?.article_data_id?.reference,
    }

    articlePublishedData.set(articleDataInfo);
    await articlePublishedData.save();

    let uploadPath = __dirname + "/../../../../public/uploads/publications/" + articlePublished._id;
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, true);
    }

    // Move file
    const original = join(__dirname, "/../../../../public/uploads/" + file.filename);
    const target = join(__dirname, "/../../../../public/uploads/publications/" + articlePublished._id + "/" + file.filename);
    await mv(original, target);

    const fileData = {
        pdf: "/uploads/publications/" + articlePublished._id + "/" + file.filename,
    }

    articlePublished.set(fileData);
    await articlePublished.save();

    // delete article correction history before deleting article from processing 
    article?.correctionHistory?.forEach(async element => {
        const articleLanguageCorrection = await ArticleLanguageCorrection.findById(element);
        const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
        
        await articleLanguageCorrectionData.delete();
        await articleLanguageCorrection.delete();        
    });

    // delete article revision history before deleting article from processing 
    article?.revisionHistory?.forEach(async element => {
        const articleRevision = await ArticleRevision.findById(element);
        const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
        
        await articleRevisionData.delete();
        await articleRevision.delete();  
    });

    await incrementPublishedArticleReport(article._author, article._id, articlePublished._id);
    await incrementPublishedCollaborationArticleReport(article.authorList ?? [], articlePublished._id);
    await incrementCompleteReviewArticleReport(article.reviewerList ?? [],  article._id, articlePublished._id);

    // delete article processing discussion before deleting article from processing 
    const articleDiscussion = await ArticleDiscussion.findById(article.article_discussion_id);
    await articleDiscussion.delete();

    // delete article processing comments before deleting article from processing 
    article?.comment?.forEach(async element => {
        const articleComment = await ArticleComment.findById(element);
        await articleComment.delete(); 
    });

    // delete article from processing 
    const articleData = await ArticleData.findById(article.article_data_id._id)
    await articleData.delete();
    await article.delete();

    // set publication list for category
    articlePublished?.category?.forEach(async element => {
        await Category.findByIdAndUpdate(
            element?._id,
            {
                $addToSet: { publications: articlePublished._id },
                $inc: { no_of_publications: 1 },
            },
            { new: true, useFindAndModify: false }
        );
    })

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: "Article is Published",
            data: req.params.articleId,
            accessToken: req.token,
        })
    );
});

// get comment 
exports.getComment = catchAsync(async (req, res) => {

    const comment = await getArticleCommentObject('', req.userId);
    let doc = await comment.getCommentInfo(req.params.commentId, req.userId);

    if (!doc) return res.status(404).json(
        Response.notFound({ message: `No Article found with that ID` })
    );

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment Reply is add for article!',
            data: doc,
            accessToken: req.token,
        })
    );
});

// add comment to specific article
exports.addComment = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in Company Mongoes models
    const { error } = articleCommentValidate({
        text: req.body.text,
        highlight: req.body.highlight,
        forArticleElement: req.body.forArticleElement,
        commenterType: req.body.userType,
        addBy: req.userId,
        forArea: req.body.selectedArea,
        startOffset: req.body.startOffset,
        endOffset: req.body.endOffset,
    });
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if[]

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== false) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to add comment while article in revision" })
        );
    } // end if

    const articleComment = new ArticleComment({
        text: req.body.text,
        highlight: req.body.highlight,
        commenterType: req.body.userType,
        forArticleElement: req.body.forArticleElement,
        addBy: req.userId,
        forArea: req.body.selectedArea,
        startOffset: req.body.startOffset,
        endOffset: req.body.endOffset,
    });
    // adding user in db using mongoes user Object
    const commentResult = await articleComment.save();

    article.comment.addToSet(commentResult);
    const result = await article.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment Reply is add for article!',
            data: result,
            accessToken: req.token,
        })
    );
});

// edit comment to of specific article
exports.editComment = catchAsync(async (req, res) => {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== false) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    } // end if

    const commentResult = await ArticleComment.findByIdAndUpdate(
        req.body.commentId,
        {
            text: req.body.text,
            isEdited: true,
        },
        {
            new: false,
            runValidators: true,
            returnOriginal: false
        }
    );

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment Reply is add for article!',
            data: commentResult,
            accessToken: req.token,
        })
    );
});

// add reply to specific comment
exports.addCommentReply = catchAsync(async (req, res) => {

    const commentInfo = await ArticleComment.findById(req.body.commentId).populate([`${req.body.commentType}`]);
    if (!commentInfo) {
        // return with error of comment not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    let uuid = uuidv4();
    let messageInfo = await Message.create({
        message: req.body.file,
        type: fileType,
        chatusers: [req.body.userId, req.body.receiverId],
        sender: req.body.userId,
        uuid: uuid,
    });

    commentInfo[`${req.body.commentType}`].addToSet(messageInfo._id);
    const result = await commentInfo.save();

    // end success response
    const data = {
        sender: req.body.userId,
        receiverId: req.body.receiverId,
        message: req.body.file,
        createdAt: Date.now(),
        uuid: uuid,
        lastMessageViewed: null,
        type: fileType
    };

    res.status(200).json(
        Response.success({
            message: 'Message send!',
            status: 200,
            data: data,
            accessToken: req.token,
        })
    );
});

// mark comment as complete
exports.markCommentComplete = catchAsync(async (req, res) => {

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== false) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const commentInfo = await ArticleComment.findById(req.params.commentId).select(['addBy', 'replies.replyBy']);
    if (!commentInfo) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    if (commentInfo.addBy != req.userId) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    commentInfo.isCompleted = true;
    commentInfo.isCompletedAt = new Date();
    commentInfo.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is marked as complete!',
            data: commentInfo,
            accessToken: req.token,
        })
    );
});

// mark comment as closed
exports.markCommentClosed = catchAsync(async (req, res) => {

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== false) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    }

    const commentInfo = await ArticleComment.findById(req.params.commentId).select(['addBy', 'replies.replyBy']);
    if (!commentInfo) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    if (commentInfo.addBy != req.userId) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    commentInfo.isClosed = true;
    commentInfo.isClosedAt = new Date();
    commentInfo.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is marked as closed!',
            data: commentInfo,
            accessToken: req.token,
        })
    );
});

// delete comment
exports.deleteComment = catchAsync(async (req, res) => {

    const article = await Article.findById(req.params.articleId);
    if (!article) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Article with this id could not be found.' })
        );
    } // end if

    if (article.isEditable !== false) {
        return res.status(400).json(
            Response.error({ message: "You are not allow to edit this article while processing" })
        );
    } // end if

    const commentInfo = await ArticleComment.findById(req.params.commentId).select(['addBy', 'replies.replyBy']);
    if (!commentInfo) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    if (commentInfo.addBy != req.userId) {
        // return with error of article not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Comment with this id could not be found.' })
        );
    } // end if

    commentInfo.isDeleted = true;
    commentInfo.save();

    res.status(200).json(
        Response.success({
            status: 200,
            message: 'Comment is deleted!',
            data: commentInfo,
            accessToken: req.token,
        })
    );
});

