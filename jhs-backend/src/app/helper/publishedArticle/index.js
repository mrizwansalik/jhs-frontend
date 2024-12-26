const { User } = require("../../models/user");

const AdminPublishedArticleHelper = require("./AdminPublishedArticleHelper");
const AdministrationPublishedArticleHelper = require("./AdministrationPublishedArticleHelper");
const PublicPublishedArticleHelper = require("./PublicPublishedArticleHelper");
const PublishedArticleHelper = require("./PublishedArticleHelper");

// get article Object
exports.getPublishedArticleObject = async (articleId, userId) => {

    const user = await User.findById(userId);

    let articleObject = null;

    switch (user?.role) {
        case 'administration':
            articleObject = new AdministrationPublishedArticleHelper();
            break;
        case 'admin':
            articleObject = new AdminPublishedArticleHelper();
            break;
        case 'employee':
            articleObject = new PublicPublishedArticleHelper();
            break;
        default:
            articleObject = new PublishedArticleHelper();
            break;
    } // end switch

    return articleObject;
};
