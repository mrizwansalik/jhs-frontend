// import models
const { Message } = require('../../models/chat/message');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const { validateErrorFormatting, getExtension } = require('../../utils/helperFunction');
const { v4: uuidv4 } = require('uuid');

// get specific chat messages
exports.getChatMessages = catchAsync(async (req, res) => {
    // find chat and update
    const chatId = req.params.chatId;
    const result = await Message.findOne({ chatId: chatId });
    // end success response
    res.status(200).json(
        Response.success({
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// mark specific message as delivered to specific user
exports.markMessageAsDelivered = catchAsync(async (req, res) => {
    // find message
    const message = await Message.findById(req.params.messageId);
    if (!message) {
        // return with error of chat not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Message not found' })
        );
    } // end if
    const userInfo = await User.findById(user);
    if (!userInfo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: 'User with this id could not be found.' })
        );
    } // end if

    message.deliveredTo.addToSet(userInfo);
    const result = await message.save();

    // end success response
    res.status(200).json(
        Response.success({
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
})

// mark specific message as read by specific user
exports.markMessageAsRead = catchAsync(async (req, res) => {

    const message = await Message.findById(req.params.messageId);
    if (!message) {
        // return with error of chat not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Message not found' })
        );
    } // end if

    const userInfo = await User.findById(user);
    if (!userInfo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: 'User with this id could not be found.' })
        );
    } // end if

    message.readBy.addToSet(userInfo);
    const result = await message.save();

    // end success response
    res.status(200).json(
        Response.success({
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
})

// update specific message
exports.updateMessage = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = messageUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find chat and update
    const messageId = req.params.messageId;
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
    res.status(200).json(
        Response.success({
            message: 'Chat updated!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// delete specific message
exports.deleteMessage = catchAsync(async (req, res) => {
    // find chat and update
    const messageId = req.params.messageId;
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
    res.status(200).json(
        Response.success({
            message: 'Chat removed!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

exports.getChat = catchAsync(async (req, res) => {
    const from = req.body.from
    const to = req.body.to

    const message = await Message.find({
        chatusers: {
            $all: [from, to]
        }
    })

    const allMessages = message.map((msg) => {

        return {
            uuid: msg.uuid,
            myself: msg.sender.toString() == req.body.from,
            message: msg.message,
            receiverId: msg.chatusers[1],
            senderId: msg.chatusers[0],
            createdAt: msg.createdAt,
            lastMessageViewed: msg.lastMessageViewed,
            type: msg.type
        }

        
    })
    res.status(200).json(
        Response.success({
            message: 'Chat Loaded!',
            status: 200,
            data: { allMessages },
            accessToken: req.token,
        })
    );

});

const get = async (req, res) => {
    const from = req.body.from
    const to = req.body.to

    const message = await Message.find({
        chatusers: {
            $all: [from, to]
        }
    })
    const allMessages = message.map((msg) => {

        return {
            uuid: msg.uuid,
            myself: msg.sender.toString() == req.body.from,
            message: msg.message,
            receiverId: msg.chatusers[1],
            senderId: msg.chatusers[0],
            createdAt: msg.createdAt,
            lastMessageViewed: msg.lastMessageViewed
        }
        
    })


    return send(res, { allMessages })
}

exports.attachments = catchAsync(async (req, res) => {
    var fileExtension = getExtension(req.body.file);
    var extensions = ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'];
    var fileType = extensions.includes(fileExtension) ? "image" : "file";

    let uuid = uuidv4();
    await Message.create({
        message: req.body.file,
        type: fileType,
        chatusers: [req.body.userId, req.body.receiverId],
        sender: req.body.userId,
        uuid: uuid,
        // createdAt: Date.now(),
        //file:req.body.file
    });

    // find chat and update
    // const messageId = req.params.messageId;

    // end success response
    const data = {
        sender: req.body.userId,
        receiverId: req.body.receiverId,
        message: req.body.file,
        createdAt: Date.now(),
        uuid: uuid,
        lastMessageViewed: null,
        type: fileType
    };

    res.status(200).json(
        Response.success({
            message: 'Attachment uploaded!',
            status: 200,
            data: data,
            accessToken: req.token,
        })
    );
});

