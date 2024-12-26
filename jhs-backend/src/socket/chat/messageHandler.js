// import models
const { Message } = require('../../app/models/chat/message');

// import utils (helper functions)
const { Response } = require('../../framework');
const { validateErrorFormatting } = require('../../app/utils/helperFunction');

// get all messages for chat
exports.getChatMessages = async (data, socket) => {
    try {
        // find chat and update
        const chatId = data.chatId;
        const result = await Message.findOne({ chatId: chatId });
        // end success response
        return socket.emit("getChatMessagesResponse",
            Response.success({
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("getChatMessagesResponse", { error: e });
    }
}

// mark messages as delivered
exports.markMessageAsDelivered = async (data, socket) => {
    try {
        // find message
        const message = await Message.findById(data.messageId);
        if (!message) {
            // return with error of chat not found in db
            return socket.emit("markMessageAsDeliveredResponse",
                Response.notFound({ message: 'Message not found' })
            );
        } // end if
        const userInfo = await User.findById(data.userId);
        if (!userInfo) {
            // return with error of user not found in db
            return socket.emit("markMessageAsDeliveredResponse",
                Response.notFound({ message: 'User with this id could not be found.' })
            );
        } // end if

        message.deliveredTo.addToSet(userInfo);
        const result = await message.save();

        // end success response
        return socket.emit("markMessageAsDeliveredResponse",
            Response.success({
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("markMessageAsDeliveredResponse", { error: e });
    }
}

// mark messages as read
exports.markMessageAsRead = async (data, socket) => {
    try {
        const message = await Message.findById(data.messageId);
        if (!message) {
            // return with error of chat not found in db
            return socket.emit("markMessageAsReadResponse",
                Response.notFound({ message: 'Message not found' })
            );
        } // end if
        const userInfo = await User.findById(data.userId);
        if (!userInfo) {
            // return with error of user not found in db
            return socket.emit("markMessageAsReadResponse",
                Response.notFound({ message: 'User with this id could not be found.' })
            );
        } // end if
        message.readBy.addToSet(userInfo);
        const result = await message.save();
        // end success response
        return socket.emit("markMessageAsReadResponse",
            Response.success({
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("markMessageAsReadResponse", { error: e });
    }
}

// update messages
exports.updateMessage = async (data, socket) => {
    try {
        // validate request body using Joi Validation define in User Mongoes models
        const { error } = messageUpdateValidate({
            text: text,
            isUpdated: true,
            textUpdatedAt: Date.now(),
        });
        if (error) {
            return socket.emit("updateMessageResponse",
                Response.validation({ data: validateErrorFormatting(error) })
            );
        } // end if
        // find chat and update
        const messageId = data.messageId;
        const result = await Message.findByIdAndUpdate(
            messageId,
            {
                text: text,
                isUpdated: true,
                textUpdatedAt: Date.now(),
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
        // end success response
        return socket.emit("updateMessageResponse",
            Response.success({
                message: 'Chat updated!',
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("updateMessageResponse", { error: e });
    }
}

// messages deleted
exports.deleteMessage = async (data, socket) => {
    try {
        // find chat and update
        const messageId = data.messageId;
        const result = await Message.findByIdAndUpdate(
            messageId,
            {
                isDeleted: true,
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
        // end success response
        return socket.emit("deleteMessageResponse",
            Response.success({
                message: 'Message is deleted!',
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("deleteMessageResponse", { error: e });
    }
}