const Cite = require("citation-js");
const { Article } = require("../../models/article/article");
const { User } = require("../../models/user");
const { publishArticle } = require("../../controllers/article/articleProcessingController");
const { ArticlePublished } = require("../../models/article/articlePublished");

class ArticleHelper {

    getArticle(articleId, authorId) {
        return Article.findOne({
            _id: articleId,
        });
    } // end function getArticle

    async getArticleAuthorInfo(articleId, userId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let authorList = article.authorList;
        authorList.push(article._author)

        let author = authorList;
        if (authorList.includes(userId)) {
            author = await User.find({
                '_id': authorList
            });
        }

        return author.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Author " + (index + 1),
                'occupation': data?.occupation ?? "-",
                'email': data?.email ?? "Email hidden",
                'phone': data?.phone ?? "Phone hidden",
                'department': data?.department ?? "Department hidden",
                'institute': data?.institute ?? "Institute hidden",
                'country': data?.country ?? "country hidden",
                'isMainAuthor': data?._id.toString() == article._author.toString(),
            }
        });
    } // end function getArticleAuthorInfo

    async getArticleReviewerInfo(articleId, reviewerId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;

        let reviewer = reviewerList;
        if (reviewerList.includes(reviewerId)) {
            reviewer = await User.find({
                '_id': reviewerList
            });
        }

        return reviewer.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Reviewer " + (index + 1),
                'occupation': data?.occupation ?? "-",
                'email': data?.email ?? "Email hidden",
                'phone': data?.phone ?? "Phone hidden",
                'department': data?.department ?? "Department hidden",
                'institute': data?.institute ?? "Institute hidden",
                'country': data?.country ?? "country hidden",
            }
        });
    } // end function getArticleReviewerInfo

    async getArticleEditorInfo(articleId, userId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;
        let authorList = article.authorList;
        authorList.push(article._author);
        let editorsList = article.editors;

        let reviewer = editorsList;
        if (!authorList.includes(userId) && !reviewerList.includes(userId)) {
            reviewer = await User.find({
                '_id': editorsList
            });
        } // end if 
        return reviewer.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Editor " + (index + 1),
                'occupation': data?.occupation ?? "-",
                'email': data?.email ?? "Email hidden",
                'phone': data?.phone ?? "Phone hidden",
                'department': data?.department ?? "Department hidden",
                'institute': data?.institute ?? "Institute hidden",
                'country': data?.country ?? "country hidden",
                'isMainAuthor': data?._id?.toString() == article?._author?.toString(),
            }
        });
    } // end function getArticleEditorInfo

    async getArticleCitation(articleId) {
        let article = await Article.findOne({
            _id: articleId,
        }).populate(['article_data_id']);
    
        var referenceText = await article?.article_data_id?.reference?.map( async (item, index) => {
            const data = await Cite.async({
                id: index,
                "citation-key": index,
                author: item?.authors,
                page: item?.pages,
                volume: item?.volume,
                issue: item?.issue,
                year: item?.year,
                'container-title': item?.journal,
                title: item?.title,
                issued: { 'date-parts': [[item?.year]] },
                type: `article-${item?.type}`,
                DOI: item?.doi,
                URL: item?.url,
            });
            const cit =  await data.format('bibliography', { format: 'text', template: "vancouver" });

            return cit;
        });
    
        return referenceText
    } // end function getArticleEditorInfo

    getArticleDetail(articleId, authorId) {
        return Article.findById(articleId).populate(["article_data_id", "articleMetaInfo", "articleStatus", "suggestedReviewerList", "category"]);
    } // end function getArticleDetail

    getArticleWithActionHistory(articleId, authorId) {
        return Article.findById(articleId).populate(["history"]);
    } // end function getArticleWithActionHistory

    getAllArticle(authorId) {
        return Article.find();
    } // end function getAllArticle

    getAllDraftArticle(authorId) {
        return Article.find({
            isDraft: true,
            "_author": authorId
        }).populate(["articleStatus"]);
    } // end function getAllDraftArticle

    getPublishedArticle(authorId) {
        return ArticlePublished.find({
            "_author": authorId
        });
    } // end function getAllDraftArticle

    getAllAssignedArticles(userId) {
        return Article.find({
            $and: [
                { isDraft: false },
                { $or: [
                    { "managedBy": userId }, 
                    { "editors": { $in: [userId] } }] }
            ]
        }).populate(["articleStatus"]);
    } // end function getAllAssignedArticles

    getAllReviewerArticles(userId) {
        return Article.find({
            $and: [
                { isDraft: false },
                { $or: [{ "reviewerList": userId }] }
            ]
        }).populate(["articleStatus"]);
    } // end function getAllReviewerArticles

    async assignEditor() {

    } // end function assignEditor

    async unAssignEditor() {

    } // end function unAssignEditor

    async addComment() {

    } // end function addComment

} // end class ArticleHelper

module.exports = ArticleHelper;