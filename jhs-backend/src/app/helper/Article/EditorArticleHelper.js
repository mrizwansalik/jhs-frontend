const { Article } = require("../../models/article/article");
const { ArticleStatus } = require('../../models/article/articleStatus');
const { User } = require("../../models/user");

const ArticleHelper = require("./ArticleHelper");

class EditorArticleHelper extends ArticleHelper {
    async getArticle(articleId, authorId) {
        return await Article.findOne({
            $and: [
                { _id: articleId },
                { $or: [{ "_author": authorId }, { "authorList": { $in: [authorId] } }] }
            ]
        });
    } // end function getArticle

    async getArticleAuthorInfo(articleId, userId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let authorList = article.authorList;
        authorList.push(article._author)

        let author = authorList;
        if(authorList.includes(userId)){
            author = await User.find({
                '_id' : authorList
            });
        }

        return author.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Author "+(index+1),
                'occupation': data?.occupation ?? "-",
                'email': data?.email ?? "Email hidden",
                'phone': data?.phone ?? "Phone hidden",
                'department': data?.department ?? "Department hidden",
                'institute': data?.institute ?? "Institute hidden",
                'country': data?.country ?? "country hidden",
                'isMainAuthor': data?._id.toString() == article?._author.toString(),
            }
        });
    } // end function getArticleAuthorInfo

    async getArticleReviewerInfo(articleId, reviewerId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;

        let reviewer = reviewerList;
        if(reviewerList.includes(reviewerId)){
            reviewer = await User.find({
                '_id' : reviewerList
            });
        }

        return reviewer.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Reviewer "+(index+1),
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

        let editorsList = article.editors;
        
        let reviewer = editorsList;

        if(editorsList.includes(userId)){
            reviewer = await User.find({
                '_id' : editorsList
            });
        } // end if 

        return reviewer.map((data, index) => {
            return {
                'id': data?._id,
                'file': data?.file,
                'name': data?.full_name ?? "Editor "+(index+1),
                'occupation': data?.occupation ?? "-",
                'email': data?.email ?? "Email hidden",
                'phone': data?.phone ?? "Phone hidden",
                'department': data?.department ?? "Department hidden",
                'institute': data?.institute ?? "Institute hidden",
                'country': data?.country ?? "country hidden",
                'isManager': data?._id.toString() == article?.managedBy?.toString(),
                'isAssignee': data?._id.toString() == article?.assignedTo?.toString(),
            }
        });
    } // end function getArticleEditorInfo

    async getArticleDetail(articleId, userId) {
        return await Article.findOne({
            $and: [
                { _id: articleId },
                { $or: [{ "_author": userId }, { "authorList": { $in: [userId] } }, { "reviewerList": { $in: [userId] } }, { "editors": { $in: [userId] } } ] }
            ]
        }).populate(["article_data_id", "articleMetaInfo", "articleStatus", "suggestedReviewerList", "category"]);
    } // end function getArticleDetail

    getAllArticle(authorId) {
        return Article.find({
            $and: [
                { isDraft: false },
                { $or: [{ "_author": authorId }, { "authorList": { $in: [authorId] } }] }
            ]
        }).populate(["articleStatus"]);
    } // end function getAllArticle
} // end class

module.exports = EditorArticleHelper;