const { User } = require("../../models/user");

const AdminChatHelper = require("./AdminChatHelper");
const AdministrationChatHelper = require("./AdministrationChatHelper");
const EmployeeChatHelper = require("./EmployeeChatHelper");
const EditorChatHelper = require("./EditorChatHelper");

// get article Object
exports.getChatObject = async (userId) => {

    const user = await User.findById(userId);

    let chatObject = null;

    switch (user.role) {
        case 'administration':
            chatObject = new AdministrationChatHelper();
            break;
        case 'admin':
            chatObject = new AdminChatHelper();
            break;
        case 'employee':
            chatObject = new EmployeeChatHelper();
            break;
        default:
            chatObject = new EditorChatHelper();
            break;
    }

    return chatObject;
};
