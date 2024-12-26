const { User } = require("../../models/user");

const AdminArticleTaskHelper = require("./AdminArticleTaskHelper");
const AdministrationArticleTaskHelper = require("./AdministrationArticleTaskHelper");
const EmployeeArticleTaskHelper = require("./EmployeeArticleTaskHelper");
const EditorArticleTaskHelper = require("./EditorArticleTaskHelper");

// get article Object
exports.getArticleTaskObject = async (userId) => {

    const user = await User.findById(userId);

    let articleObject = null;

    switch (user.role) {
        case 'administration':
            articleObject = new AdministrationArticleTaskHelper();
            break;
        case 'admin':
            articleObject = new AdminArticleTaskHelper();
            break;
        case 'employee':
            articleObject = new EmployeeArticleTaskHelper();
            break;
        default:
            articleObject = new EditorArticleTaskHelper();
            break;
    }

    return articleObject;
};
