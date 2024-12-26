const { Article } = require("../../models/article/article");
const { User } = require("../../models/user");

const ArticleHelper = require("./ArticleHelper");


class AdministrationArticleHelper extends ArticleHelper {

    async getArticle(articleId, authorId) {
        return await Article.findOne({
            _id: articleId,
        });
    } // end function getArticle

    async getArticleAuthorInfo(articleId, userId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;
        let authorList = article.authorList;

        authorList.push(article._author)

        let author = authorList;
        if(!reviewerList.includes(userId)){
            author = await User.find({
                '_id' : authorList
            });
        } // end if 

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
                'isMainAuthor': data?._id?.toString() == article?._author?.toString(),
            }
        });
    } // end function getArticleAuthorInfo

    async getArticleReviewerInfo(articleId, userId) {
        let article = await Article.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;
        let authorList = article.authorList;
        authorList.push(article._author)

        let reviewer = reviewerList;
        if(!authorList.includes(userId)){
            reviewer = await User.find({
                '_id' : reviewerList
            });
        } // end if 

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

        let reviewerList = article.reviewerList;
        let authorList = article.authorList;
        authorList.push(article._author)
        let editorsList = article.editors;
        
        let reviewer = editorsList;
        if(!authorList.includes(userId) && !reviewerList.includes(userId)){
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

    async getArticleDetail(articleId, authorId) {
        return await Article.findById(articleId).populate(["article_data_id", "articleMetaInfo", "articleStatus", "suggestedReviewerList", "category"]);
    } // end function getArticleDetail

    getAllArticle(authorId) {
        return Article.find({ isDraft: false }).populate(["articleStatus"]);
    } // end function getAllArticle
}

module.exports = AdministrationArticleHelper;