const { User } = require("../../models/user");

const AdminArticleCommentHelper = require("./AdminArticleCommentHelper");
const AdministrationArticleCommentHelper = require("./AdministrationArticleCommentHelper");
const EmployeeArticleCommentHelper = require("./EmployeeArticleCommentHelper");
const EditorArticleCommentHelper = require("./EditorArticleCommentHelper");

// get article Object
exports.getArticleCommentObject = async (commentId, userId) => {

    const user = await User.findById(userId);

    let articleObject = null;

    switch (user?.role) {
        case 'administration':
            articleObject = new AdministrationArticleCommentHelper();
            break;
        case 'admin':
            articleObject = new AdminArticleCommentHelper();
            break;
        case 'employee':
            articleObject = new EmployeeArticleCommentHelper();
            break;
        default:
            articleObject = new EditorArticleCommentHelper();
            break;
    }

    return articleObject;
};
