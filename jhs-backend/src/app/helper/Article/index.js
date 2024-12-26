const { User } = require("../../models/user");

const AdminArticleHelper = require("./AdminArticleHelper");
const AdministrationArticleHelper = require("./AdministrationArticleHelper");
const EmployeeArticleHelper = require("./EmployeeArticleHelper");
const EditorArticleHelper = require("./EditorArticleHelper");

// get article Object
exports.getArticleObject = async (articleId, userId) => {

    const user = await User.findById(userId);

    let articleObject = null;

    switch (user.role) {
        case 'administration':
            articleObject = new AdministrationArticleHelper();
            break;
        case 'admin':
            articleObject = new AdminArticleHelper();
            break;
        case 'employee':
            articleObject = new EmployeeArticleHelper();
            break;
        default:
            articleObject = new EditorArticleHelper();
            break;
    } // end switch

    return articleObject;
};
