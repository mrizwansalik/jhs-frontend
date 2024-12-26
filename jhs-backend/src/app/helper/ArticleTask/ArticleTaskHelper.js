const { ArticleTask } = require("../../models/article/articleTask");

class ArticleTaskHelper {
    async getTaskInfo(taskId) {
        return await ArticleTask.findById(taskId).populate(['addBy', 'article', 'assignedTo', 'comment.commentBy', 'change_editor.editor', 'change_editor.newEditor' , 'change_editor.actionBy']);
    }
    
    getTaskList(userId) {
        return ArticleTask.find(
            { $or: [{ "addBy": userId }, { "assignedTo": { $in: [userId] } }] }
        );
    }

    getArticleTaskList(articleId, userId) {
        return ArticleTask.find(
            {'article': articleId},
            { $or: [{ "addBy": userId }, { "assignedTo": { $in: [userId] } }] }
        );
    }
}

module.exports = ArticleTaskHelper;