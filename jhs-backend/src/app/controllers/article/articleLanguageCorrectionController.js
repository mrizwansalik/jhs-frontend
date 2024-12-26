// third party import
const { promisify } = require('util');
const fs = require("fs");
const { join } = require('path');
const mv = promisify(fs.rename);

// import modelsArticleStatus
const { ArticleLanguageCorrection, articleLanguageCorrectionUpdateValidate } = require('../../models/article/articleLanguageCorrection');
const { ArticleLanguageCorrectionData } = require('../../models/article/articleLanguageCorrectionData');
const { ArticleType } = require('../../models/article/articleType')

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { validateErrorFormatting, parseVancouverReferences, checkCitationSequence, checkTableSequence, checkFigureSequence, makeReferenceTextFromList } = require('../../utils/helperFunction');
const { Response } = require('../../../framework');

// import config information
const { Article } = require('../../models/article/article');
const { articleReferenceDataValidate, articleValidateAlreadyExist } = require('../../models/article/articleData');
const { addArticleStatusHistory } = require('../../utils/article/history');

// get specific article Status
exports.getArticleLanguageCorrection = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.id);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   let doc = await ArticleLanguageCorrection.findOne({
      $and: [
         { _id: article.article_languageCorrection_id, },
         { $or: [{ "assignee": req.userId }] }
      ]
   }).populate(["articleLanguageCorrection_data_id"]);

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

exports.getArticleLanguageCorrectionDetail = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.id);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   let doc = await ArticleLanguageCorrection.findOne({
      $and: [
         { _id: article.article_languageCorrection_id, },
         //{ $or: [{ "assignee": req.userId }] }
      ]
   }).populate(["articleLanguageCorrection_data_id"]);

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

exports.getArticleLanguageCorrectionReferencesTextList = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.id).populate(["article_data_id"]);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   let doc = await ArticleLanguageCorrection.findOne({
      $and: [
         { _id: article.article_languageCorrection_id, },
         //{ $or: [{ "assignee": req.userId }] }
      ]
   }).populate(["articleLanguageCorrection_data_id"]);

   if (!doc) return res.status(404).json(
      Response.notFound({ message: `No Article found with that ID` })
   );

   var oldReferenceList = await makeReferenceTextFromList(article?.article_data_id?.reference)
   var newReferenceList = await makeReferenceTextFromList(doc?.articleLanguageCorrection_data_id?.reference)

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
exports.updateArticleLanguageCorrection = catchAsync(async (req, res) => {

   const articleInfo = {
      title: req.body.title,
      abstract: req.body.abstract,
      keywords: req.body.keywords,
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
   const { error } = articleLanguageCorrectionUpdateValidate({ ...articleInfo, ...articleDataInfo });
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
   const resultArticleLanguageCorrection = await ArticleLanguageCorrection.findByIdAndUpdate(
      article.article_languageCorrection_id,
      { ...articleInfo, ...checkVerification },
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   )

   const articleDataId = resultArticleLanguageCorrection.articleLanguageCorrection_data_id;
   const resultArticleLanguageCorrectionData = await ArticleLanguageCorrectionData.findByIdAndUpdate(
      articleDataId,
      articleDataInfo,
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   );

   const result = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Article Language Correction updated!',
         data: result,
         accessToken: req.token,
      })
   );
});

// update specific article status
exports.validateArticleLanguageCorrection = catchAsync(async (req, res) => {
   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `LanguageCorrection with this id could not be found.` })
      );
   } // end if

   let warningMessages = [];
   let errorCheck = false;

   const articleType = await ArticleType.findOne({ name: articleLanguageCorrection?.type })
   if (!articleType) {
      warningMessages.push({
         goto: 'title',
         type: 'Missing title',
         message: `Article Type is invalid`
      });
   } // end if

   if (articleLanguageCorrection?.title === undefined || articleLanguageCorrection?.title === "") {
      warningMessages.push({
         goto: 'title',
         type: 'Missing title',
         message: `Please add article title`
      });
   }

   if (articleLanguageCorrection?.abstract === undefined || articleLanguageCorrection?.abstract === "") {
      warningMessages.push({
         goto: 'abstract',
         type: 'Missing abstract',
         message: `Please add article abstract`
      });
   }

   if (articleLanguageCorrection?.keywords === undefined) {
      warningMessages.push({
         goto: 'keyword',
         type: 'Missing keyword',
         message: `Please add article abstract`
      });
   }

   if (articleLanguageCorrection?.keywords.length <= 2) {
      warningMessages.push({
         goto: 'keyword',
         type: 'Missing keyword',
         message: `Please add at-least 3 keywords`
      });
   }

   const requiredElement = articleType?.elements?.map((item) => { return item })
   for (let element of requiredElement) {
      if (articleLanguageCorrection?.articleLanguageCorrection_data_id[element] === undefined || articleLanguageCorrection?.articleLanguageCorrection_data_id[element] === "") {
         warningMessages.push({
            goto: element,
            type: `Missing ${element}`,
            message: `Please add article ${element}`
         });
      }
   }

   let tableTitleText;
   const tableTitle = articleLanguageCorrection.articleLanguageCorrection_data_id?.table_list;
   tableTitle.map((item, index) => {
      tableTitleText += item.title;
      tableTitleText += item.label ?? "";
      tableTitleText += item.data;
   });
   let figureTitleText;
   const figureTitle = articleLanguageCorrection.articleLanguageCorrection_data_id?.figures_list;
   figureTitle.map((item, index) => {
      figureTitleText += item.title;
      figureTitleText += item.label ?? "";
   });

   const articleData =
      articleLanguageCorrection.articleLanguageCorrection_data_id.introduction +
      articleLanguageCorrection.articleLanguageCorrection_data_id.conclusion +
      articleLanguageCorrection.articleLanguageCorrection_data_id.methodology +
      articleLanguageCorrection.articleLanguageCorrection_data_id.case_presentation +
      articleLanguageCorrection.articleLanguageCorrection_data_id.result +
      articleLanguageCorrection.articleLanguageCorrection_data_id.discussion +
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
   if ((articleLanguageCorrection.articleLanguageCorrection_data_id.reference).length != checkCitationSequenceResponse?.citation.length) {
      // return with error of reference not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'reference',
         type: 'Incomplete Citation',
         message: `Reference list is incomplete, You must need ${checkCitationSequenceResponse?.citation.length} reference, but this article contain ${(articleLanguageCorrection.articleLanguageCorrection_data_id.reference).length} reference`
      })
   } // end if

   let referencesWarningMessages = []
   const references = articleLanguageCorrection.articleLanguageCorrection_data_id.reference;
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
   if ((articleLanguageCorrection.articleLanguageCorrection_data_id.table_list).length != checkTableSequenceResponse?.tableCitation.length) {
      // return with error of table list not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'introduction',
         type: 'Incomplete Table Citation',
         message: `Table list is incomplete, You must need ${checkTableSequenceResponse?.tableCitation.length} table, but this article contain ${(articleLanguageCorrection.articleLanguageCorrection_data_id.table_list).length} table`
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
   if ((articleLanguageCorrection.articleLanguageCorrection_data_id.figures_list).length != checkFigureSequenceResponse?.figureCitation.length) {
      // return with error of figures list not match with citation
      errorCheck = true;
   } // end if
   if (errorCheck) {
      warningMessages.push({
         goto: 'introduction',
         type: 'Incomplete Figure Citation',
         message: `Figure list is incomplete, You must need ${checkFigureSequenceResponse?.figureCitation.length} figure, but this article contain ${(articleLanguageCorrection.articleLanguageCorrection_data_id.figures_list).length} figure`
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

   articleLanguageCorrection.set({ isVerified: true });
   const resultArticleLanguageCorrection = await articleLanguageCorrection.save();

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Article verified!',
         data: resultArticleLanguageCorrection,
         accessToken: req.token,
      })
   );
});

// suggest Reference to specific article
exports.updateLanguageCorrectionReferenceSorting = catchAsync(async (req, res) => {
   const reference = req.body.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const result = await ArticleLanguageCorrectionData.findByIdAndUpdate(
      articleLanguageCorrection.articleLanguageCorrection_data_id,
      { reference: reference },
      {
         new: false,
         runValidators: true,
         returnOriginal: false
      }
   );

   articleLanguageCorrection.set({ isVerified: false });
   await articleLanguageCorrection.save();

   const resultArticleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Reference updated!',
         data: resultArticleLanguageCorrection,
         accessToken: req.token,
      })
   );
});

// add reference to specific article
exports.addLanguageCorrectionReference = catchAsync(async (req, res) => {
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

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   articleData.reference.addToSet(reference);
   const result = await articleData.save();

   articleLanguageCorrection.set({ isVerified: false });
   await articleLanguageCorrection.save();

   const articleResult = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

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
exports.generateLanguageCorrectionReference = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleLanguageCorrectionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleLanguageCorrection with this id could not be found.' })
      );
   } // end if

   var referencesText = req.body.reference;

   const references = parseVancouverReferences(referencesText);

   for (let i = 0; i < references.length; i++) {
      articleLanguageCorrectionData.reference.addToSet(references[i]);
      await articleLanguageCorrectionData.save();

   } // end 

   articleLanguageCorrection.set({ isVerified: false });
   await articleLanguageCorrection.save();

   const articleResult = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

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
exports.launchLanguageCorrectionReference = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleResult = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

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
exports.removeLanguageCorrectionReference = catchAsync(async (req, res) => {
   const referenceId = req.body.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate("articleLanguageCorrection_data_id");
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const result = await articleLanguageCorrection.articleLanguageCorrection_data_id.updateOne(
      { $pull: { "reference": { "_id": referenceId } } },
      { multi: true }
   );

   articleLanguageCorrection.set({ isVerified: false });
   await articleLanguageCorrection.save();

   const articleResult = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

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
exports.getSpecificLanguageCorrectionReference = catchAsync(async (req, res) => {
   const referenceId = req.params.reference;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate("articleLanguageCorrection_data_id");
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const result = articleLanguageCorrection?.articleLanguageCorrection_data_id?.reference?.find((reference) => reference._id == referenceId)

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
exports.updateLanguageCorrectionReference = catchAsync(async (req, res) => {
   const reference = req.body.reference;
   const articleReferenceID = req.body.referenceId;

   // validate request body using Joi Validation define in ArticleLanguageCorrection Mongoes models
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

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if


   const result = await ArticleLanguageCorrectionData.findOneAndUpdate(
      { '_id': articleLanguageCorrection.articleLanguageCorrection_data_id, "reference._id": articleReferenceID },
      {
         $set: { "reference.$": reference }
      },
      {
         new: false,
         runValidators: true,
         returnOriginal: false,
      });

   articleLanguageCorrection.set({ isVerified: false });
   await articleLanguageCorrection.save();

   const articleResult = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate(["articleLanguageCorrection_data_id"]);

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

   const articleLanguageCorrection = ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      return res.status(404).json(
         Response.notFound({ message: 'Article ' })
      );
   }


})

// add figure to specific article
exports.addLanguageCorrectionFigure = catchAsync(async (req, res) => {
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

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleLanguageCorrection with this id could not be found.' })
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
exports.uploadLanguageCorrectionFigure = catchAsync(async (req, res) => {
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

   const article = await ArticleLanguageCorrection.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'ArticleLanguageCorrection with this id could not be found.' })
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
exports.updateLanguageCorrectionFigure = catchAsync(async (req, res) => {

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

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleLanguageCorrectionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   if (!articleLanguageCorrectionData.figures_list) {
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

   if (req.body.position !== undefined && articleLanguageCorrectionData.figures_list.length > req.body.position) {
      const figureIndex = articleLanguageCorrectionData.figures_list.findIndex(figure => figure._id.equals(articleFigureId));
      if (figureIndex === -1) {
         return res.status(404).json({ message: 'Figure not found in the array.' });
      }

      // Update the fields of the figure
      req.body.title ? articleLanguageCorrectionData.figures_list[figureIndex].title = req.body.title : '';
      req.body.label ? articleLanguageCorrectionData.figures_list[figureIndex].label = req.body.label : '';
      articleLanguageCorrectionData.figures_list[figureIndex].thumbnail_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleLanguageCorrectionData.figures_list[figureIndex].medium_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleLanguageCorrectionData.figures_list[figureIndex].picture_url = "/uploads/article/" + article._id + "/" + file.filename;
      articleLanguageCorrectionData.figures_list[figureIndex].xl_picture_url = "/uploads/article/" + article._id + "/" + file.filename;

      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the figure

      // Remove the element from its current position in the array
      const removedFigure = articleLanguageCorrectionData.figures_list.splice(figureIndex, 1)[0];

      // Insert the element at the new position in the array
      articleLanguageCorrectionData.figures_list.splice(indexToInsert, 0, removedFigure);

      // Save the updated articleData
      result = await articleLanguageCorrectionData.save();
   } else {
      result = await ArticleLanguageCorrectionData.findOneAndUpdate(
         { '_id': articleLanguageCorrection.articleLanguageCorrection_data_id, "figures_list._id": articleFigureId },
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
exports.removeLanguageCorrectionFigure = catchAsync(async (req, res) => {
   const articleFigureID = req.body.articleFigureID;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate("articleLanguageCorrection_data_id");
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const result = await articleLanguageCorrection.articleLanguageCorrection_data_id.updateOne(
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
exports.updateLanguageCorrectionFigureSorting = catchAsync(async (req, res) => {
   const figures_list = req.body.figures_list;

   const article = await ArticleLanguageCorrection.findById(req.params.articleId);
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

   const articleData = await ArticleLanguageCorrectionData.findById(article.article_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `Article data not found.` })
      );
   } // end if

   const result = await ArticleLanguageCorrectionData.findByIdAndUpdate(
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
exports.addLanguageCorrectionTable = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleLanguageCorrectionData) {
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

   if (req.body.position !== undefined && articleLanguageCorrectionData.table_list.length > req.body.position) {
      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table
      articleLanguageCorrectionData.table_list.splice(indexToInsert, 0, table);
   } else {
      const insertedData = articleLanguageCorrectionData.table_list.addToSet(table);
      insertedId = insertedData[0]._id;
   }

   const result = await articleLanguageCorrectionData.save();

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
exports.updateLanguageCorrectionTable = catchAsync(async (req, res) => {
   const articleTableId = req.body.tableId;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrectionData = await ArticleLanguageCorrectionData.findById(articleLanguageCorrection.articleLanguageCorrection_data_id);
   if (!articleLanguageCorrectionData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   if (!articleLanguageCorrectionData.table_list) {
      return res.status(404).json(
         Response.notFound({ message: 'Table information not found.' })
      );
   }
   let result = null;

   if (req.body.position !== undefined && articleLanguageCorrectionData.table_list.length > req.body.position) {
      const tableIndex = articleLanguageCorrectionData.table_list.findIndex(table => table._id.equals(articleTableId));
      if (tableIndex === -1) {
         return res.status(404).json({ message: 'Table not found in the array.' });
      }

      // Update the fields of the table
      req.body.title ? articleLanguageCorrectionData.table_list[tableIndex].title = req.body.title : '';
      req.body.label ? articleLanguageCorrectionData.table_list[tableIndex].label = req.body.label : '';
      req.body.data ? articleLanguageCorrectionData.table_list[tableIndex].data = req.body.data : '';
      req.body.data ? articleLanguageCorrectionData.table_list[tableIndex].tableAssociated = req.body.tableAssociated : '';

      const indexToInsert = req.body.position - 1; // Specify the index where you want to insert the table

      // Remove the element from its current position in the array
      const removedTable = articleData.table_list.splice(tableIndex, 1)[0];

      // Insert the element at the new position in the array
      articleData.table_list.splice(indexToInsert, 0, removedTable);

      // Save the updated articleData
      result = await articleData.save();
   } else {
      result = await ArticleLanguageCorrectionData.findOneAndUpdate(
         { '_id': articleLanguageCorrection.articleLanguageCorrection_data_id, "table_list._id": articleTableId },
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
exports.removeLanguageCorrectionTable = catchAsync(async (req, res) => {
   const articleTableID = req.body.articleTableID;

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id).populate('articleLanguageCorrection_data_id');
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const result = await articleLanguageCorrection.articleLanguageCorrection_data_id.updateOne(
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
exports.updateLanguageCorrectionTableSorting = catchAsync(async (req, res) => {
   const table_list = req.body.table_list;

   const article = await ArticleLanguageCorrection.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `Articlewith this id could not be found.` })
      );
   } // end if

   if (article.isEditable !== true) {
      return res.status(400).json(
         Response.error({ message: "You are not allow to edit this article while processing" })
      );
   }

   const articleData = await ArticleLanguageCorrectionData.findById(article.article_data_id);
   if (!articleData) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: `Articledata not found.` })
      );
   } // end if

   const result = await ArticleLanguageCorrectionData.findByIdAndUpdate(
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
exports.submitArticleLanguageCorrection = catchAsync(async (req, res) => {

   const article = await Article.findById(req.params.articleId);
   if (!article) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrection = await ArticleLanguageCorrection.findById(article.article_languageCorrection_id);
   if (!articleLanguageCorrection) {
      // return with error of article not found in db
      return res.status(404).json(
         Response.notFound({ message: 'Article with this id could not be found.' })
      );
   } // end if

   const articleLanguageCorrectionInfo = {
      submittedAt: new Date(),
      isVerified: true,
      submitted: 1,
   }

   const articleInfo = {
      submittedAt: new Date(),
      isVerified: true,
      submitted: 1,
      status: 1,
      payment: -1,
   }

   if (articleLanguageCorrection.isVerified == true) {
      // set languageCorrection 
      articleLanguageCorrection.set(articleLanguageCorrectionInfo);
      resultArticleLanguageCorrection = await articleLanguageCorrection.save();
      // set article
      article.set(articleInfo);
      resultArticle = await article.save();
   } else {
      // return with error of article not found in db
      return res.status(403).json(
         Response.notFound({ message: 'Please verify article to submit.' })
      );
   } // end else

   await addArticleStatusHistory(article.history, ((req.body.processingText != '') ? req.body.processingText : "Article is Submitted"), 'Language correction Submitted', req.userId);

   // send success response
   res.status(200).json(
      Response.success({
         status: 200,
         message: 'Language Correction submitted!',
         data: resultArticle,
         accessToken: req.token,
      })
   );
});