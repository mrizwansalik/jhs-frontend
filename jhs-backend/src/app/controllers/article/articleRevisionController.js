// third party import
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require("fs");
const { join } = require('path');
const mv = promisify(fs.rename);

require('@citation-js/plugin-enw');
require('@citation-js/plugin-refworks');
require('@citation-js/plugin-ris');
require('@citation-js/plugin-bibtex');

const { v4: uuidv4 } = require('uuid');
const { Cite } = require('@citation-js/core')

//const Citation = require('citation');

// import modelsArticleStatus
const { ArticleRevision, articleRevisionUpdateValidate, articleRevisionValidate } = require('../../models/article/articleRevision');
const { ArticleRevisionData, articleRevisionDataValidate, articleRevisionDataUpdateValidate, articleRevisionReferenceDataValidate, articleGenerateReferenceDataValidate, articleRevisionValidateAlreadyExist } = require('../../models/article/articleRevisionData');
const { ArticleType } = require('../../models/article/articleType')

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting, parseVancouverReferences, checkCitationSequence, checkTableSequence, checkFigureSequence, getExtension, makeReferenceTextFromList } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');

// import config information
const { ArticleStatus } = require('../../models/article/articleStatus');
const ArticleHelper = require('../../helper/Article/ArticleHelper');
const { getArticleObject } = require('../../helper/Article/index');
const { Article } = require('../../models/article/article');
const { articleReferenceDataValidate, articleValidateAlreadyExist } = require('../../models/article/articleData');
const { addArticleStatusHistory } = require('../../utils/article/history');
const { default: mongoose } = require('mongoose');

// get specific article Status
exports.getArticleRevision = catchAsync(async (req, res) => {
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

exports.getArticleRevisionDetail = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.id);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   let doc = await ArticleRevision.findOne({
      $and: [
         { _id: article.article_revision_id, },
         //{ $or: [{ "_author": mongoose.Types.ObjectId(req.userId) }, { "authorList": { $in: [mongoose.Types.ObjectId(req.userId)] } } ] }
      ]
   }).populate(["articleRevision_data_id", "articleMetaInfo", "suggestedReviewerList"]);

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

exports.getArticleRevisionReferencesTextList = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.id).populate(["article_data_id"]);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   let doc = await ArticleRevision.findOne({
      $and: [
         { _id: article.article_revision_id, },
         //{ $or: [{ "assignee": req.userId }] }
      ]
   }).populate(["articleRevision_data_id"]);

   if (!doc) return res.status(404).json(
      Response.notFound({ message: `No Article found with that ID` })
   );

   var oldReferenceList = await makeReferenceTextFromList(article?.article_data_id?.reference)
   var newReferenceList = await makeReferenceTextFromList(doc?.articleRevision_data_id?.reference)

   res.status(200).json(
      Response.success({
         message: 'Article found',
         status: 200,
         data: {oldReferenceList, newReferenceList},
         accessToken: req.token,
      })
   );
});

// update specific article status
exports.updateArticleRevision = catchAsync(async (req, res) => {

   const articleInfo = {
      title: req.body.title,
      type: req.body.type,
      abstract: req.body.abstract,
      keywords: req.body.keywords,
      category: req.body.category,
      journal_info: req.body.journal_info,
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
   const { error } = articleRevisionUpdateValidate({ ...articleInfo, ...articleDataInfo });
   if (error) {
      return res.status(422).json(
         Response.validation({ data: validateErrorFormatting(error) })
      );
   } // end if

   const articleId = req.params.articleId;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   // find article status and update
   const resultArticleRevision = await ArticleRevision.findByIdAndUpdate(
      article.article_revision_id,
      { ...articleInfo, ...checkVerification },
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   )

   const articleDataId = resultArticleRevision.articleRevision_data_id;
   const resultArticleRevisionData = await ArticleRevisionData.findByIdAndUpdate(
      articleDataId,
      articleDataInfo,
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   );

   const result = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Article Revision updated!',
         data: result,
         accessToken: req.token,
      })
   );
});

// update specific article status
exports.validateArticleRevision = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `Revision with this id could not be found.` })
      );
   } // end if

   let warningMessages = [];
   let errorCheck = false;

   const articleType = await ArticleType.findOne({ name: articleRevision?.type })
   if (!articleType) {
      warningMessages.push({
         goto: 'title',
         type: 'Missing title',
         message: `Article Type is invalid`
      });
   } // end if

   if (articleRevision?.title === undefined || articleRevision?.title === "") {
      warningMessages.push({
         goto: 'title',
         type: 'Missing title',
         message: `Please add article title`
      });
   }

   if (articleRevision?.abstract === undefined || articleRevision?.abstract === "") {
      warningMessages.push({
         goto: 'abstract',
         type: 'Missing abstract',
         message: `Please add article abstract`
      });
   }

   if (articleRevision?.keywords === undefined) {
      warningMessages.push({
         goto: 'keyword',
         type: 'Missing keyword',
         message: `Please add article abstract`
      });
   }

   if (articleRevision?.keywords.length <= 2) {
      warningMessages.push({
         goto: 'keyword',
         type: 'Missing keyword',
         message: `Please add at-least 3 keywords`
      });
   }

   const requiredElement = articleType?.elements?.map((item) => { return item })
   for (let element of requiredElement) {
      if (articleRevision?.articleRevision_data_id[element] === undefined || articleRevision?.articleRevision_data_id[element] === "") {
         warningMessages.push({
            goto: element,
            type: `Missing ${element}`,
            message: `Please add article ${element}`
         });
      }
   }

   let tableTitleText;
   const tableTitle = articleRevision.articleRevision_data_id?.table_list;
   tableTitle.map((item, index) => {
      tableTitleText += item.title;
      tableTitleText += item.label ?? "";
      tableTitleText += item.data;
   });
   let figureTitleText;
   const figureTitle = articleRevision.articleRevision_data_id?.figures_list;
   figureTitle.map((item, index) => {
      figureTitleText += item.title;
      figureTitleText += item.label ?? "";
   });

   const articleData =
      articleRevision.articleRevision_data_id.introduction +
      articleRevision.articleRevision_data_id.conclusion +
      articleRevision.articleRevision_data_id.methodology +
      articleRevision.articleRevision_data_id.case_presentation +
      articleRevision.articleRevision_data_id.result +
      articleRevision.articleRevision_data_id.discussion +
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
   if ((articleRevision.articleRevision_data_id.reference).length != checkCitationSequenceResponse?.citation.length) {
      // return with error of reference not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'reference',
         type: 'Incomplete Citation',
         message: `Reference list is incomplete, You must need ${checkCitationSequenceResponse?.citation.length} reference, but this article contain ${(articleRevision.articleRevision_data_id.reference).length} reference`
      })
   } // end if

   let referencesWarningMessages = []
   const references = articleRevision.articleRevision_data_id.reference;
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
   if ((articleRevision.articleRevision_data_id.table_list).length != checkTableSequenceResponse?.tableCitation.length) {
      // return with error of table list not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'introduction',
         type: 'Incomplete Table Citation',
         message: `Table list is incomplete, You must need ${checkTableSequenceResponse?.tableCitation.length} table, but this article contain ${(articleRevision.articleRevision_data_id.table_list).length} table`
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
   if ((articleRevision.articleRevision_data_id.figures_list).length != checkFigureSequenceResponse?.figureCitation.length) {
      // return with error of figures list not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'introduction',
         type: 'Incomplete Figure Citation',
         message: `Figure list is incomplete, You must need ${checkFigureSequenceResponse?.figureCitation.length} figure, but this article contain ${(articleRevision.articleRevision_data_id.figures_list).length} figure`
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

   articleRevision.set({ isVerified: true });
   const resultArticleRevision = await articleRevision.save();

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Article Revision verified!',
         data: resultArticleRevision,
         accessToken: req.token,
      })
   );
});

// suggest Reference to specific article
exports.updateRevisionReferenceSorting = catchAsync(async (req, res) => {
   const reference = req.body.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const result = await ArticleRevisionData.findByIdAndUpdate(
      articleRevision.articleRevision_data_id,
      { reference: reference },
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   );

   articleRevision.set({ isVerified: false });
   await articleRevision.save();

   const resultArticleRevision = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Reference updated!',
         data: resultArticleRevision,
         accessToken: req.token,
      })
   );
});

// add reference to specific article
exports.addRevisionReference = catchAsync(async (req, res) => {
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

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   articleData.reference.addToSet(reference);
   const result = await articleData.save();

   articleRevision.set({ isVerified: false });
   await articleRevision.save();

   const articleResult = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

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
exports.generateRevisionReference = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleRevisionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleRevision with this id could not be found.' })
      );
   } // end if

   var referencesText = req.body.reference;

   const references = parseVancouverReferences(referencesText);

   for (let i = 0; i < references.length; i++) {
      articleRevisionData.reference.addToSet(references[i]);
      await articleRevisionData.save();

   } // end 

   articleRevision.set({ isVerified: false });
   await articleRevision.save();

   const articleResult = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

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
exports.launchRevisionReference = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleResult = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

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
exports.removeRevisionReference = catchAsync(async (req, res) => {
   const referenceId = req.body.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id).populate("articleRevision_data_id");
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const result = await articleRevision.articleRevision_data_id.updateOne(
      { $pull: { "reference": { "_id": referenceId } } },
      { multi: true }
   );

   articleRevision.set({ isVerified: false });
   await articleRevision.save();

   const articleResult = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

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
exports.getSpecificRevisionReference = catchAsync(async (req, res) => {
   const referenceId = req.params.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id).populate("articleRevision_data_id");
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const result = articleRevision?.articleRevision_data_id?.reference?.find((reference) => reference._id == referenceId)

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
exports.updateRevisionReference = catchAsync(async (req, res) => {
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

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if


   const result = await ArticleRevisionData.findOneAndUpdate(
      { '_id': articleRevision.articleRevision_data_id, "reference._id": articleReferenceID },
      {
         $set: { "reference.$": reference }
      },
      {
         new: false,
         runValidators: true,
         returnOriginal: false,
      });

   articleRevision.set({ isVerified: false });
   await articleRevision.save();

   const articleResult = await ArticleRevision.findById(article.article_revision_id).populate(["articleRevision_data_id", "suggestedReviewerList"]);

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

exports.updateReferenceDOI = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      return res.status(404).json(
         Response.notFound({ message: 'Article ' })
      );
   }


})

// add figure to specific article
exports.addRevisionFigure = catchAsync(async (req, res) => {
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

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleRevision with this id could not be found.' })
      );
   } // end if

   let uploadPath = __dirname + "/../../../../public/uploads/article/" + article._id;
   if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, true);
   }


   // Move file
   const original = join(__dirname, "/../../../../public/uploads/" + file.filename);
   const target = join(__dirname, "/../../../../public/uploads/article/" + article._id + "/" + file.filename);
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
exports.uploadRevisionFigure = catchAsync(async (req, res) => {
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

   const article = await ArticleRevision.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleRevision with this id could not be found.' })
      );
   } // end if

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
exports.updateRevisionFigure = catchAsync(async (req, res) => {

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

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleRevisionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   if (!articleRevisionData.figures_list) {
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
   const target = join(__dirname, "/../../../../public/uploads/article/" + article._id + "/" + file.filename);
   await mv(original, target);

   let result = null;

   if (req.body.position !== undefined && articleRevisionData.figures_list.length > req.body.position) {
      const figureIndex = articleRevisionData.figures_list.findIndex(figure => figure._id.equals(articleFigureId));
      if (figureIndex === -1) {
         return res.status(404).json({ message: 'Figure not found in the array.' });
      }

      // Update the fields of the figure
      req.body.title ? articleRevisionData.figures_list[figureIndex].title = req.body.title : '';
      req.body.label ? articleRevisionData.figures_list[figureIndex].label = req.body.label : '';
      articleRevisionData.figures_list[figureIndex].thumbnail_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleRevisionData.figures_list[figureIndex].medium_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleRevisionData.figures_list[figureIndex].picture_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleRevisionData.figures_list[figureIndex].xl_picture_url = "/uploads/article/" + article._id + "/" + file.filename;

      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the figure

      // Remove the element from its current position in the array
      const removedFigure = articleRevisionData.figures_list.splice(figureIndex, 1)[0];

      // Insert the element at the new position in the array
      articleRevisionData.figures_list.splice(indexToInsert, 0, removedFigure);

      // Save the updated articleData
      result = await articleRevisionData.save();
   } else {
      result = await ArticleRevisionData.findOneAndUpdate(
         { '_id': articleRevision.articleRevision_data_id, "figures_list._id": articleFigureId },
         {
            $set: {
               "figures_list.$.title": req.body.title,
               "figures_list.$.label": req.body.label ?? '',
               "figures_list.$.thumbnail_url": "/uploads/article/" + article._id + "/" + file.filename,
               "figures_list.$.medium_url": "/uploads/article/" + article._id + "/" + file.filename,
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
exports.removeRevisionFigure = catchAsync(async (req, res) => {
   const articleFigureID = req.body.articleFigureID;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id).populate("articleRevision_data_id");
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const result = await articleRevision.articleRevision_data_id.updateOne(
      { $pull: { "figures_list": { "_id": articleFigureID } } },
      { multi: true }
   );

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
exports.updateRevisionFigureSorting = catchAsync(async (req, res) => {
   const figures_list = req.body.figures_list;

   const article = await ArticleRevision.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `ArticleRevision with this id could not be found.` })
      );
   } // end if

   if (article.isEditable !== true) {
      return res.status(400).json(
         Response.error({ message: "You are not allow to edit this article while processing" })
      );
   }

   const articleData = await ArticleRevisionData.findById(article.article_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `ArticleRevision data not found.` })
      );
   } // end if

   const result = await ArticleRevisionData.findByIdAndUpdate(
      article.article_data_id,
      { figures_list: figures_list },
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
         message: 'Figure is updated!',
         data: result,
         accessToken: req.token,
      })
   );
});

// add table to specific article
exports.addRevisionTable = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleRevisionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const table = {
      title: req.body.title,
      label: req.body.label,
      data: req.body.data,
      tableAssociated: req.body.tableAssociated,
   }
   let insertedId = null;

   if (req.body.position !== undefined && articleRevisionData.table_list.length > req.body.position) {
      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table
      articleRevisionData.table_list.splice(indexToInsert, 0, table);
   } else {
      const insertedData = articleRevisionData.table_list.addToSet(table);
      insertedId = insertedData[0]._id;
   }

   const result = await articleRevisionData.save();

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
exports.updateRevisionTable = catchAsync(async (req, res) => {
   const articleTableId = req.body.tableId;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const articleRevisionData = await ArticleRevisionData.findById(articleRevision.articleRevision_data_id);
   if (!articleRevisionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   if (!articleRevisionData.table_list) {
      return res.status(404).json(
         Response.notFound({ message: 'Table information not found.' })
      );
   }
   let result = null;

   if (req.body.position !== undefined && articleRevisionData.table_list.length > req.body.position) {
      const tableIndex = articleRevisionData.table_list.findIndex(table => table._id.equals(articleTableId));
      if (tableIndex === -1) {
         return res.status(404).json({ message: 'Table not found in the array.' });
      }

      // Update the fields of the table
      req.body.title ? articleRevisionData.table_list[tableIndex].title = req.body.title : '';
      req.body.label ? articleRevisionData.table_list[tableIndex].label = req.body.label : '';
      req.body.data ? articleRevisionData.table_list[tableIndex].data = req.body.data : '';
      req.body.data ? articleRevisionData.table_list[tableIndex].tableAssociated = req.body.tableAssociated : '';

      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table

      // Remove the element from its current position in the array
      const removedTable = articleData.table_list.splice(tableIndex, 1)[0];

      // Insert the element at the new position in the array
      articleData.table_list.splice(indexToInsert, 0, removedTable);

      // Save the updated articleData
      result = await articleData.save();
   } else {
      result = await ArticleRevisionData.findOneAndUpdate(
         { '_id': articleRevision.articleRevision_data_id, "table_list._id": articleTableId },
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
exports.removeRevisionTable = catchAsync(async (req, res) => {
   const articleTableID = req.body.articleTableID;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id).populate('articleRevision_data_id');
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   const result = await articleRevision.articleRevision_data_id.updateOne(
      { $pull: { "table_list": { "_id": articleTableID } } },
      { multi: true }
   );

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
exports.updateRevisionTableSorting = catchAsync(async (req, res) => {
   const table_list = req.body.table_list;

   const article = await ArticleRevision.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `ArticleRevision with this id could not be found.` })
      );
   } // end if

   if (article.isEditable !== true) {
      return res.status(400).json(
         Response.error({ message: "You are not allow to edit this article while processing" })
      );
   }

   const articleData = await ArticleRevisionData.findById(article.article_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `ArticleRevision data not found.` })
      );
   } // end if

   const result = await ArticleRevisionData.findByIdAndUpdate(
      article.article_data_id,
      { table_list: table_list },
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
         message: 'Table is updated!',
         data: result,
         accessToken: req.token,
      })
   );
});
// update specific article status
exports.submitArticleRevision = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleRevision = await ArticleRevision.findById(article.article_revision_id);
   if (!articleRevision) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article Revision with this id could not be found.' })
      );
   } // end if

   let articleStatus = await ArticleStatus.findOne({ name: "Revision Submitted" });

   const articleRevisionInfo = {
      submittedAt: new Date(),
      isVerified: true,
      submitted: 1,
   }

   const articleInfo = {
      submittedAt: new Date(),
      isVerified: true,
      submitted: 1,
      status: -1,
      articleStatus: { "_id": articleStatus._id },
   }

   if (articleRevision.isVerified == true) {
      // set revision 
      articleRevision.set(articleRevisionInfo);
      resultArticleRevision = await articleRevision.save();
      // set article
      article.set(articleInfo);
      resultArticle = await article.save();
   } else {
      // return with error of article not found in db
      return res.status(403).json(
         Response.notFound({ message: 'Please verify article to submit.' })
      );
   } // end else

   await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article Revision is Submitted"), "Revision Submitted", req.userId);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: "Revision Submitted",
         data: resultArticle,
         accessToken: req.token,
      })
   );
});