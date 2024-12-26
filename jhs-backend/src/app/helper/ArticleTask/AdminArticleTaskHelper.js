const { ArticleTask } = require("../../models/article/articleTask");
const factory = require('../../controllers/handleFactory');
const ArticleTaskHelper = require("./ArticleTaskHelper");

class AdminArticleTaskHelper extends ArticleTaskHelper {
    async getTaskInfo(taskId) {
        return await ArticleTask.findById(taskId).populate(['addBy', 'article', 'assignedTo', 'comment.commentBy', 'change_editor.editor', 'change_editor.newEditor' , 'change_editor.actionBy']);
    }
    
    getTaskList(userId) {
        return ArticleTask.find();
    }

    getArticleTaskList(articleId, userId) {
        return ArticleTask.find(
            {'article': articleId}
        );
    }
}

module.exports = AdminArticleTaskHelper;