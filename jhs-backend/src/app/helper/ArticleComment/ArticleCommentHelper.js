const { ArticleComment } = require("../../models/article/articleComment");
const factory = require('../../controllers/handleFactory');
const { mongoose } = require("mongoose");
const { Article } = require("../../models/article/article");

class ArticleCommentHelper {
    async getCommentInfo(commentId, userId) {
        return await ArticleComment.findById(commentId).select([
            '+replies.replyBy', '+addBy'
        ]);
    }
    
    async getArticleComments(articleId, userId) {
        const articleInfo = await Article.findById(articleId);
        
        return ArticleComment.find({'_id': { $in: articleInfo.comment }}).select([
            '+replies.replyBy', '+addBy'
        ]);
    }

    async getActiveComments(articleId, userId) {
        const articleInfo = await Article.findById(articleId);
        return ArticleComment.find({'_id': { $in: articleInfo?.comment }, isCompleted: false, isClosed: false, isDeleted: false}).select([
            '+replies.replyBy', '+addBy'
        ]).sort({ updatedAt:'desc', createdAt:'desc'});
    }
}

module.exports = ArticleCommentHelper;