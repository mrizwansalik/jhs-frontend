// import models
const { Chat, chatValidate, chatUpdateValidate } = require('../../models/chat/chat');
const { User } = require('../../models/user');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');
const { validateErrorFormatting } = require('../../utils/helperFunction');
const { Message } = require('../../models/chat/message');
const { getChatObject } = require('../../helper/Chat');
const APIFeatures = require('../../utils/apiFeatures');

// get all chats 
exports.getAllChats = catchAsync(async (req, res) => { 
    
    let filter = {};
    if (req.params.tourId) filter.tourId = {tour: req.params.tourId};

    const chat = await getChatObject(req.userId);
    let query = chat.getAllChats(req.userId);

    const features = new APIFeatures(query, req.query)
            .filter()
            .sorting();

    const doc = await features.query;

    res.status(200).json(
        Response.success({ 
            message: 'Success',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
})
exports.getMyChats = catchAsync(async (req, res) => { 
    
    let filter = {};
    if (req.params.tourId) filter.tourId = {tour: req.params.tourId};

    const chat = await getChatObject(req.userId);
    let query = chat.getMyChats(req.userId);

    const features = new APIFeatures(query, req.query)
            .filter()
            .sorting();

    const doc = await features.query;

    res.status(200).json(
        Response.success({ 
            message: 'Success',
            status: 200,
            data: doc,
            accessToken: req.token,
        })
    );
})

// get specific chat
exports.getUserChat = catchAsync(async (req, res) => {
    // find chat and update
    const chatId = req.params.chatId;
    // find chat by chat
    const result = await Chat.findById(chatId);
    // end success response
    res.status(200).json(
        Response.success({
            message: "Chat data!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// create new chat
exports.createChat = catchAsync(async (req, res, next) => {
    // read request body
    const title = req.body.title;
    const article = req.body.article;

    // validate request body using Joi Validation define in User Mongoes models
    const { error } = chatValidate(req.body);
    if (error) {
        return res.status(422).json(
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
    res.status(200).json(
        Response.success({
            message: "Chat created!",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// update specific chat
exports.updateChat = catchAsync(async (req, res) => {
    // validate request body using Joi Validation define in User Mongoes models
    const { error } = chatUpdateValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if
    // find chat and update
    const chatId = req.params.chatId;
    const result = await Chat.findByIdAndUpdate(
        chatId,
        {
            title: req.body.title,
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

// update specific chat
exports.markChatAsClosed = catchAsync(async (req, res) => {
    // find chat and update
    const chatId = req.params.chatId;
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
    res.status(200).json(
        Response.success({
            message: 'Chat marked as closed!',
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// add new message
exports.sendMessage = catchAsync(async (req, res) => {
    // read request body
    const text = req.body.text;
    const images = req.body.images;
    const files = req.body.files;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
        // return with error of chat not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Chat with this id could not be found.' })
        );
    } // end if
    if (chat.isClosed) {
        // return with error of chat is closed
        return res.status(404).json(
            Response.notFound({ message: 'Your are not allowed to send message in closed chat.' })
        );
    } // end if

    // validate request body using Joi Validation define in User Mongoes models
    const { error } = chatValidate(req.body);
    if (error) {
        return res.status(422).json(
            Response.validation({ data: validateErrorFormatting(error) })
        );
    } // end if

    // create new Chat content object
    const message = new Message({
        text: text,
        files: files,
        images: images,
        sender: req.userId,
        chatId: req.params.chatId
    });

    // adding chat in db using mongoes chat content Object
    const result = await message.save();

    // end success response
    res.status(200).json(
        Response.success({
            message: "Message send",
            status: 200,
            data: result,
            accessToken: req.token,
        })
    );
});

// add user to specific chat
exports.addUser = catchAsync(async (req, res) => {
    const user = req.body.user;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
        // return with error of chat not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Chat with this id could not be found.' })
        );
    } // end if

    const userInfo = await User.findById(user);
    if (!userInfo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: 'User with this id could not be found.' })
        );
    } // end if
    if (chat.isClosed) {
        // return with error of chat is closed
        return res.status(404).json(
            Response.notFound({ message: 'Your are not allowed to add user in closed chat.' })
        );
    } // end if

    chat.user.addToSet(userInfo);
    const result = await chat.save();

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'user is added to chat!',
            data: result,
            accessToken: req.token,
        })
    );
});

// remove user to specific chat
exports.removeUser = catchAsync(async (req, res) => {
    const user = req.body.user;

    const chat = await Chat.findById(req.params.chatId);
    if (!chat) {
        // return with error of chat not found in db
        return res.status(404).json(
            Response.notFound({ message: 'Chat with this id could not be found.' })
        );
    } // end if

    const userInfo = await User.findById(user);
    if (!userInfo) {
        // return with error of user not found in db
        return res.status(404).json(
            Response.notFound({ message: 'User with this id could not be found.' })
        );
    } // end if

    const result = await chat.updateOne(
        { $pull: { "user": { "_id": user } } },
        { multi: true }
    );

    // send success response
    res.status(200).json(
        Response.success({
            status: 200,
            message: 'User is removed to chat!',
            data: result,
            accessToken: req.token,
        })
    );
});