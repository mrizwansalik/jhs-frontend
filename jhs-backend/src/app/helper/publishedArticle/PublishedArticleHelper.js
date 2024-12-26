const Cite = require("citation-js");
const { User } = require("../../models/user");
const { ArticlePublished } = require("../../models/article/articlePublished");

class PublishedArticleHelper {

    getArticle(articleId, authorId) {
        return ArticlePublished.findOne({
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

    async getArticleCitation(articleId) {
        let article = await ArticlePublished.findOne({
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
        return ArticlePublished.findById(articleId).populate(["articlePublished_data_id", "journal_info"]);
    } // end function getArticleDetail

    getPublishedArticle(authorId) {
        return ArticlePublished.find({
            "_author": authorId
        }).populate(["articleMatrices_data_id"]);
    } // end function getPublishedArticle

    async getPublishedArticleReferencesTextList(articleId) {
        let article = await ArticlePublished.findOne({
            _id: articleId,
        }).populate(["articlePublished_data_id"]);

        return article?.articlePublished_data_id?.reference;

    } // end function getPublishedArticle
} // end class ArticleHelper

module.exports = PublishedArticleHelper;