const { Chat } = require("../../models/chat/chat");
const ChatHelper = require("./ChatHelper");

class EditorChatHelper extends ChatHelper {
    async getChat(userId) {
        return await Chat.findOne({ 
            _id: userId,
        });
    }

    getAllChats(userId) {
        return Chat.find({ 
            "user": { $in: [userId] } 
        }).populate(["article"]).sort({"updatedAt":-1});
    }

    getMyChats(userId) {
        return Chat.find({ 
            "user": { $in: [userId] } 
        }).populate(["article"]).sort({"updatedAt":-1});
    }
}

module.exports = EditorChatHelper;