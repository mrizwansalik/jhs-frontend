const { ArticleComment } = require("../../models/article/articleComment");
const factory = require('../../controllers/handleFactory');
const ArticleCommentHelper = require("./ArticleCommentHelper");
const { Article } = require("../../models/article/article");

class EditorArticleCommentHelper extends ArticleCommentHelper {
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
}

module.exports = EditorArticleCommentHelper;