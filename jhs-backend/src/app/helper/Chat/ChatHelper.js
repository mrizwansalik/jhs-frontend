const { Chat } = require("../../models/user");

class ChatHelper {
    async getChat(userId) {
        return await Chat.findOne({ 
            _id: userId,
        });
    }

    getAllChat(userId) {
        return Chat.find({ 
            "user": { $in: [userId] } 
        }).populate(["article"]).sort({"updatedAt":-1});
    }

    getMyChat(userId) {
        return Chat.find({ 
            "user": { $in: [userId] } 
        }).populate(["article"]).sort({"updatedAt":-1});
    }
}

module.exports = ChatHelper;