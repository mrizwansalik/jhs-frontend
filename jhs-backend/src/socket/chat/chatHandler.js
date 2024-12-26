// import models
const { Chat, chatValidate, chatUpdateValidate } = require('../../app/models/chat/chat');
const { User } = require('../../app/models/user');

// import utils (helper functions)
const { Response } = require('../../framework');
const { validateErrorFormatting } = require('../../app/utils/helperFunction');
const { Message } = require('../../app/models/chat/message');

// create new chat
exports.getChat = async (data, socket) => {
    try {
        return socket.emit("getChatResponse",
            Response.success({
                message: "Chat List!",
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("getChatResponse", { error: e });
    }
};

// create new chat
exports.createChat = async (data, socket) => {
    try {
        // read request body
        const title = data.title;
        const article = data.article;

        // validate request body using Joi Validation define in User Mongoes models
        const { error } = chatValidate({
            title: title,
            article: article,
        });
        if (error) {
            return socket.emit("createChatResponse",
                Response.validation({ data: validateErrorFormatting(error) })
            );
        } // end if
        // create new Chat object
        const chat = new Chat({
            title: title,
            article: article,
        });
        // adding chat in db using mongoes chat Object
        const result = await chat.save();
        // end success response
        return socket.emit("createChatResponse",
            Response.success({
                message: "Chat created!",
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("createChatResponse", { error: e });
    }
};

// update specific chat
exports.updateChat = async (data) => {
    try {
        // validate request body using Joi Validation define in User Mongoes models
        const { error } = chatUpdateValidate({
            title: data.title,
        });
        if (error) {
            return socket.emit("updateChatResponse",
                Response.validation({ data: validateErrorFormatting(error) })
            );
        } // end if

        // find chat and update
        const chatId = data.chatId;
        const result = await Chat.findByIdAndUpdate(
            chatId,
            {
                title: data.title,
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
        // end success response
        return socket.emit("updateChatResponse",
            Response.success({
                message: 'Chat updated!',
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("updateChatResponse", { error: e });
    }
};

// mark chat as closed
exports.markChatAsClosed = async (data) => {
    try {// find chat and update
        const chatId = data.chatId;
        const result = await Chat.findByIdAndUpdate(
            chatId,
            {
                isClosed: true,
                isClosedAt: Date.now()
            },
            {
                new: false,
                runValidators: true,
                returnOriginal: false
            }
        );
        // end success response
        return socket.emit("markChatAsClosedResponse",
            Response.success({
                message: 'Chat marked as closed!',
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("markChatAsClosedResponse", { error: e });
    }
};

// add new message
exports.sendMessage = async (data) => {
    try {
        // read request body
        const text = data.text;
        const images = data.images;
        const files = data.files;

        const chat = await Chat.findById(data.chatId);
        if (!chat) {
            // return with error of chat not found in db
            return socket.emit("sendMessageResponse",
                Response.notFound({ message: 'Chat with this id could not be found.' })
            );
        } // end if

        if (chat.isClosed) {
            // return with error of chat is closed
            return socket.emit("sendMessageResponse",
                Response.notFound({ message: 'Your are not allowed to send message in closed chat.' })
            );
        } // end if

        // create new Chat content object
        const message = new Message({
            text: text,
            files: files,
            images: images,
            sender: data.userId,
            chatId: data.chatId
        });

        // adding chat in db using mongoes chat content Object
        const result = await message.save();

        // end success response
        return socket.emit("sendMessageResponse",
            Response.success({
                message: "Message send",
                status: 200,
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("sendMessageResponse", { error: e });
    }
};

// add user to specific chat
exports.addUser = async (data) => {
    try {
        const user = data.user;
        const chat = await Chat.findById(data.chatId);
        if (!chat) {
            // return with error of chat not found in db
            return socket.emit("addUserResponse",
                Response.notFound({ message: 'Chat with this id could not be found.' })
            );
        } // end if

        const userInfo = await User.findById(user);
        if (!userInfo) {
            // return with error of user not found in db
            return socket.emit("addUserResponse",
                Response.notFound({ message: 'User with this id could not be found.' })
            );
        } // end if
        if (chat.isClosed) {
            // return with error of chat is closed
            return socket.emit("addUserResponse",
                Response.notFound({ message: 'Your are not allowed to add user in closed chat.' })
            );
        } // end if

        chat.user.addToSet(userInfo);
        const result = await chat.save();

        // send success response
        return socket.emit("addUserResponse",
            Response.success({
                status: 200,
                message: 'user is added to chat!',
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("addUserResponse", { error: e });
    }
};

// remove user to specific chat
exports.removeUser = async (data) => {
    try {
        const user = data.user;

        const chat = await Chat.findById(data.chatId);
        if (!chat) {
            // return with error of chat not found in db
            return socket.emit("removeUserResponse",
                Response.notFound({ message: 'Chat with this id could not be found.' })
            );
        } // end if

        const userInfo = await User.findById(user);
        if (!userInfo) {
            // return with error of user not found in db
            return socket.emit("removeUserResponse",
                Response.notFound({ message: 'User with this id could not be found.' })
            );
        } // end if

        const result = await chat.updateOne(
            { $pull: { "user": { "_id": user } } },
            { multi: true }
        );

        // send success response
        return socket.emit("removeUserResponse",
            Response.success({
                status: 200,
                message: 'User is removed to chat!',
                data: result,
            })
        );
    } catch (e) {
        return socket.emit("removeUserResponse", { error: e });
    }
};