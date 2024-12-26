const { ArticlePublished } = require("../../models/article/articlePublished");
const { User } = require("../../models/user");

const PublishedArticleHelper = require("./PublishedArticleHelper");


class AdministrationPublishedArticleHelper extends PublishedArticleHelper {

    async getArticle(articleId, authorId) {
        return await ArticlePublished.findOne({
            _id: articleId,
        });
    } // end function getArticle

    async getArticleAuthorInfo(articleId, userId) {
        let article = await ArticlePublished.findOne({
            _id: articleId,
        });

        let authorList = article.authorList ?? [];

        authorList.push(article._author)

        let author = authorList;
        author = await User.find({
            '_id' : authorList
        });

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
        let article = await ArticlePublished.findOne({
            _id: articleId,
        });

        let reviewerList = article.reviewerList;;
        let reviewer = await User.find({
            '_id' : reviewerList
        });

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
        let article = await ArticlePublished.findOne({
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
        return await ArticlePublished.findById(articleId).populate(["articlePublished_data_id", "journal_info", "articleMatrices_data_id"]);
    } // end function getArticleDetail
}

module.exports = AdministrationPublishedArticleHelper;