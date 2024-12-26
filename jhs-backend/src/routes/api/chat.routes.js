// third party import
const express = require('express');

// import Controller
const chatController = require('../../app/controllers/chat/chatController');
const messageController = require('../../app/controllers/chat/messageController');
const fileMiddleware = require('../../app/middleware/upload')

// include middleware 
const isAuth = require('../../app/middleware/auth'); 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');

const router = express.Router();

router.get('/chat', [isAuth], chatController.getAllChats);
router.post('/:chatId/updateChat', [isAuth], chatController.updateChat);
router.post("/createChat", [isAuth], chatController.createChat);

router.post("/:chatId/markChatAsClosed", [isAuth], chatController.markChatAsClosed);
router.post('/:chatId/sendMessage', [isAuth], chatController.sendMessage);

router.put("/:chatId/addUser", [isAuth], chatController.addUser);
router.put("/:chatId/removeUser", [isAuth], chatController.removeUser);

router.post('/getChatMessages', [isAuth], messageController.getChatMessages);

router.post("/markMessageAsDelivered", [isAuth], messageController.markMessageAsDelivered);
router.post("/markMessageAsRead", [isAuth], messageController.markMessageAsRead);

router.post("/updateMessage", [isAuth], messageController.updateMessage);
router.post("/deleteMessage", [isAuth], messageController.deleteMessage);
router.post("/get-chat", [isAuth], messageController.getChat);

router.post("/attachments", [isAuth, fileMiddleware], messageController.attachments);



module.exports = router;
