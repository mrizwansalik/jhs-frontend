const { Chat } = require("../../models/chat/chat");
const ChatHelper = require("./ChatHelper");

class AdminChatHelper extends ChatHelper {
    async getChat(userId) {
        return await Chat.findOne({ 
            _id: userId,
        });
    }

    getAllChats(userId) {
        return Chat.find().populate(["user", "article"]).sort({"updatedAt":-1});
    }

    getMyChats(userId) {
        return Chat.find({ 
            "user": { $in: [userId] } 
        }).populate(["user", "article"]).sort({"updatedAt":-1});
    }
}

module.exports = AdminChatHelper;