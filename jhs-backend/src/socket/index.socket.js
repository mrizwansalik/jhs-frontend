const { WebSocketServer, WebSocket } = require('ws');
const { v4: uuidv4 } = require('uuid');
const { checkToken, checkAuthUser, getUsers } = require("./../app/utils/helperFunction");
const { Message } = require('../app/models/chat/message');
const { User } = require('../app/models/user');
const { ArticleComment } = require('../app/models/article/articleComment');
const { getArticleCommentObject } = require('../app/helper/ArticleComment');
const { Article } = require('../app/models/article/article');
const { ArticleDiscussion } = require('../app/models/article/articleDiscussion');

exports.getSocket = (application) => {

  const wss = new WebSocketServer({ noServer: true });
  const notificationWss = new WebSocketServer({ noServer: true });
  const articleProcessingWss = new WebSocketServer({ noServer: true });
  const articleDiscussionWss = new WebSocketServer({ noServer: true });

  application.server.on('upgrade', function upgrade(request, socket, head) {
    const pathname = request.url;
    switch (pathname) {
      case '/chat':
        wss.handleUpgrade(request, socket, head, async function done(ws) {
          let token = request.headers['sec-websocket-protocol']
          let user = await checkAuthUser(token)
          if (user) {
            ws.user = user;
            wss.emit('connection', ws, request);
          }
          else {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
        });
        break;
      case '/notification':
        notificationWss.handleUpgrade(request, socket, head, async function done(notificationWs) {
          let token = request.headers['sec-websocket-protocol']
          if (token) {
            let user = await checkAuthUser(token)
            notificationWs.user = user;
            notificationWss.emit('connection', notificationWs, request);
          }
          else {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
        });
        break;
      case '/articleProcessing':
        articleProcessingWss.handleUpgrade(request, socket, head, async function done(articleProcessingWs) {
          let token = request.headers['sec-websocket-protocol']
          if (token) {
            let user = await checkAuthUser(token)
            articleProcessingWs.user = user;
            articleProcessingWss.emit('connection', articleProcessingWs, request);
          }
          else {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
        });
        break;
      case '/articleDiscussion':
        articleDiscussionWss.handleUpgrade(request, socket, head, async function done(articleDiscussionWs) {
          let token = request.headers['sec-websocket-protocol']
          if (token) {
            let user = await checkAuthUser(token)
            articleDiscussionWs.user = user;
            articleDiscussionWss.emit('connection', articleDiscussionWs, request);
          }
          else {
            socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
            socket.destroy();
            return;
          }
        });
        break;

      default:
        return ''
    }
  });

  const intervalTime = 5000; //1 mint interval

  // web socket for chat
  wss.on('connection', async (websocketConnection, connectionRequest, client) => {
    websocketConnection.isOnline = true;
    const usersToChatWith = await getUsers(websocketConnection.user._id);    // get the users to whom the login user can do a chat
    // keep the ids of user get from get user function  in array
    let chatUserIds = [];
    usersToChatWith.map((user) => {
      chatUserIds.push(user.user._id)
    });

    //store the ids of users in socket connection
    websocketConnection.chatUserIds = chatUserIds;
    websocketConnection.usersToChatWith = usersToChatWith;

    websocketConnection.send(JSON.stringify({
      data: { users: usersToChatWith },
      method: "SET_CHAT_USERS",
      status: 200
    }));

    // Socket Connection for chat
    websocketConnection.on('message', function message(message) {
      message = JSON.parse(message);

      switch (message.method) {
        case 'SET_CHAT_USERS':
          wss.clients.forEach(async function each(client) {
            if (client == websocketConnection) {
              const usersToChatWith = await getUsers(websocketConnection.user._id);
              client.send(JSON.stringify({
                data: { users: usersToChatWith },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

        case 'PONG':
          websocketConnection.isOnline = true;
          userLastActive(websocketConnection.user);
          break;

        case 'GET_PERMISSION':
          websocketConnection.isAuthorized = true;
          if ((websocketConnection.user._id).include("permission")) {
            websocketConnection.isAuthorized = true;
          } // end if
          break;

        case 'SET_SESSION':
          websocketConnection.receiverId = message.receiverId;
          websocketConnection.userId = message.userId;
          break;

        case 'SEND_MESSAGE':
          let uuid = uuidv4();
          wss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId || client == websocketConnection) {
              client.send(JSON.stringify({
                data: {
                  sender: websocketConnection.userId,
                  receiverId: websocketConnection.receiverId,
                  message: message.message,
                  createdAt: Date.now(),
                  uuid: uuid,
                  lastMessageViewed: null,
                  type: 'text'
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.message) {
            Message.create({
              message: message.message,
              chatusers: [websocketConnection.userId, websocketConnection.receiverId],
              sender: websocketConnection.user._id,
              uuid: uuid,
              type: 'text'
            });
          } // end if
          break;

        case 'SEEN_MESSAGE':
          wss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  lastMessageViewed: message.uuid,
                  sender: websocketConnection.userId,
                  receiverId: websocketConnection.receiverId
                  
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.uuid) {
            findMessage(message.uuid, websocketConnection.receiverId, websocketConnection.userId);
          } // end if
          break;

        case 'TYPING':
          wss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  isTyping: message.typing,
                  sender: websocketConnection.userId
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

      } // end switch
      return;
    });
  });

  // web socket for article comment processing
  articleProcessingWss.on('connection', async (websocketConnection, connectionRequest, client) => {
    websocketConnection.isOnline = true;
    // Socket Connection for article comment processing
    websocketConnection.on('message', function message(message) {
      message = JSON.parse(message);

      switch (message.method) {
        case 'SET_MY_ARTICLE_COMMENTS':
          articleProcessingWss.clients.forEach(async function each(client) {
            if (client == websocketConnection) {
              const articleComment = await getActiveComments(message.articleId, websocketConnection.user._id);
              client.send(JSON.stringify({
                data: articleComment,
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

        case 'MARK_COMMENT_AS_COMPLETE':
          articleProcessingWss.clients.forEach(async function each(client) {
            if (client == websocketConnection) {
              if (message.commentId) {
                const commentInfo = await getSpecificComment(message.commentId, websocketConnection.user._id);
                const commentBy = commentInfo.addBy;
                if (commentBy?._id?.toString() == websocketConnection.user._id && commentInfo.isCompleted == false) {
                  findCommentToSetAsComplete(message.commentId)
                }
              } // end if
              client.send(JSON.stringify({
                data: "Marked as complete",
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

        case 'MARK_COMMENT_AS_CLOSED':
          articleProcessingWss.clients.forEach(async function each(client) {
            if (client == websocketConnection) {
              if (message.commentId) {
                const commentInfo = await getSpecificComment(message.commentId, websocketConnection.user._id);
                if (commentInfo.isCompleted == false && commentInfo.isClosed == false) {
                  findCommentToSetAsClosed(message.commentId, websocketConnection.user._id)
                }
              } // end if
              client.send(JSON.stringify({
                data: "Marked as closed",
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

        case 'SEND_REPLY':
          articleProcessingWss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  commentId: message.commentId,
                  replyBy: websocketConnection.userId,
                  articleId: websocketConnection.articleId,
                  message: message.message,
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.message) {
            findCommentToSetReply(message.commentId, {
              text: message.message,
              replyBy: websocketConnection.userId,
            });
          } // end if
          break;

        case 'EDIT_REPLY':
          articleProcessingWss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  commentId: message.commentId,
                  replyBy: websocketConnection.userId,
                  articleId: websocketConnection.articleId,
                  message: message.message,
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.message) {
            findCommentToSetReply(message.commentId, {
              text: message.message,
              replyBy: websocketConnection.userId,
            });
          } // end if
          break;

        case 'DELETE_REPLY':
          articleProcessingWss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  commentId: message.commentId,
                  replyBy: websocketConnection.userId,
                  articleId: websocketConnection.articleId,
                  message: message.message,
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.message) {
            findCommentAndDelete(message.commentId, {
              text: message.message,
              replyBy: websocketConnection.userId,
            });
          } // end if
          break;

      } // end switch
      return;
    });
  });


  // web socket for article discussion
  articleDiscussionWss.on('connection', async (websocketConnection, connectionRequest, client) => {
    websocketConnection.isOnline = true;
    // Socket Connection for article discussion
    websocketConnection.on('message', async function message(message) {
      message = JSON.parse(message);
      switch (message.method) {
        case 'SET_ARTICLE_DISCUSSION_TYPE':
          articleDiscussionWss.clients.forEach(async function each(client) {
            if (client == websocketConnection) {
              const articleId = message.articleId;
              const userId = websocketConnection.user._id
              const types = await getDiscussionTypes(articleId, userId);
              client.send(JSON.stringify({
                data: {
                  types: types
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

        case 'PONG':
          websocketConnection.isOnline = true;
          userLastActive(websocketConnection.user);
          break;

        case 'GET_ARTICLE_DISCUSSION_PERMISSION':
          websocketConnection.isAuthorized = true;
          if ((websocketConnection.user._id).include("permission")) {
            websocketConnection.isAuthorized = true;
          } // end if
          break;

        case 'SET_ARTICLE_DISCUSSION_SESSION':
          websocketConnection.commentId = message.commentId;
          websocketConnection.articleId = message.articleId;
          websocketConnection.type = message.type;
          websocketConnection.userId = message.from;
          break;

        case 'SEND_ARTICLE_DISCUSSION_REPLY':
          let uuid = uuidv4();
          articleDiscussionWss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId || client == websocketConnection) {
              client.send(JSON.stringify({
                data: {
                  sender: websocketConnection.userId,
                  receiverId: websocketConnection.receiverId,
                  message: message.message,
                  createdAt: Date.now(),
                  uuid: uuid,
                  lastMessageViewed: null,
                  type: 'text'
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.message) {
            let articleInfo = await Article.findById(message.articleId);
            let discussionInfo
            let discussionBelongsTo
            if (message.commentId != '0') {
              discussionBelongsTo = 'comment'
              discussionInfo = await ArticleComment.findById(message.commentId).populate([`${message.type}`]);
            } else {
              discussionBelongsTo = 'discussion'
              discussionInfo = await ArticleDiscussion.findById(articleInfo.article_discussion_id).populate([`${message.type}`]);
            }
            const messageInfo = await Message.create({
              message: message.message,
              chatusers: [...articleInfo.authorList],
              sender: websocketConnection.user._id,
              uuid: uuid,
              type: 'text',
              belongsTo: discussionBelongsTo,
            });
            discussionInfo[`${message.type}`].addToSet(messageInfo._id);
            discussionInfo.save();
          } // end if
          break;

        case 'SEEN_ARTICLE_DISCUSSION_MESSAGE':
          articleDiscussionWss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  lastMessageViewed: message.uuid,
                  sender: websocketConnection.userId,
                  receiverId: websocketConnection.receiverId
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          if (message.uuid) {
            findMessage(message.uuid, websocketConnection.receiverId, websocketConnection.userId);
          } // end if
          break;

        case 'TYPING':
          wss.clients.forEach(function each(client) {
            if (websocketConnection.receiverId === client.userId) {
              client.send(JSON.stringify({
                data: {
                  isTyping: message.typing,
                  sender: websocketConnection.userId
                },
                method: message.method,
                status: 200
              }));
            } // end if
          });
          break;

      } // end switch
      return;
    });
  });

  const interval = setInterval(() => {
    wss.clients.forEach(function each(client) {
      if (client.isOnline === false) {
        return client.terminate();
      } // end if
      client.isOnline = false;
      client.send(JSON.stringify({
        data: { connectedUsers: getConnectedUsers(client.user._id) },
        method: "PING",
        status: 200
      }));
    });
  }, 8000);

  // function for check which users is online 
  const getConnectedUsers = (userId) => {
    let connectedUsers = [];
    wss.clients.forEach(function each(client) {
      if (client?.chatUserIds?.some((item) => item.equals(userId))) {
        connectedUsers.push(client.user._id);
      } // end if
    });
    return connectedUsers;
  } // end function
} // end function

const getDiscussionTypes = async (articleId, userId) => {
  const type = [];
  if(articleId){
    const article = await Article.findById(articleId);
    if (article?.authorList?.map((data) => { return data.toString() })?.includes(userId.toString()) || article?._author.toString() == userId.toString()) {
      type.push('authors');
    } // end if
  
    if (article?.reviewerList?.map((data) => { return data.toString() })?.includes(userId.toString())) {
      type.push('reviewers');
    } // end if

    if (article?.editors?.map((data) => { return data.toString() })?.includes(userId.toString())) {
      type.push('editor');
    } // end if
  
    if (!(article?.authorList?.map((data) => { return data.toString() })?.includes(userId.toString())) && article?._author.toString() != userId.toString()) {
      type.push('reviewers_editor');
    } // end if
  
    if (!(article?.reviewerList?.map((data) => { return data.toString() })?.includes(userId.toString()))) {
      type.push('authors_editor');
    } // end if
  }
  return type;
}

// get last seen
const userLastActive = async (pongUser) => {
  try {
    let user = await User.findOne({ _id: pongUser._id });
    user.lastActiveAt = Date.now();
    user.save();
    return true;
  }
  catch (err) {
    return false
  } // end catch
} // end function 

// find Message by uuid and mark message seen
const findMessage = async (uuid, receiver, sender) => {
  try {
    // websocketConnection.receiverId
    let msgSeen = await Message.updateMany({ chatusers: { $all: [sender, receiver] } }, { $set: { lastMessageViewed: uuid } });
    return true;
  }
  catch (err) {
    return false
  } // end catch
} // end function

const getActiveComments = async (articleId, userId) => {
  const comments = await getArticleCommentObject('', userId);
  return await comments.getActiveComments(articleId, userId);
} // end function

const getSpecificComment = async (commentId, userId) => {
  const comment = await getArticleCommentObject('', userId);
  return await comment.getCommentInfo(commentId, userId);
} // end function

// find comment by ID and change text
const findCommentToSetText = async (commentId, text) => {
  try {
    await ArticleComment.findByIdAndUpdate(
      commentId,
      {
        text: text,
        isEdited: true,
      },
      {
        new: false,
        runValidators: true,
        returnOriginal: false
      }
    );
    return true;
  } catch (err) {
    return false
  } // end catch
} // end function

// find comment by ID and delete
const findCommentAndDelete = async (commentId, text) => {
  try {
    await ArticleComment.findByIdAndUpdate(
      commentId,
      {
        isDeleted: true,
        isDeletedAt: new Date(),
      },
      {
        new: false,
        runValidators: true,
        returnOriginal: false
      }
    );
    return true;
  } catch (err) {
    return false
  } // end catch
} // end function

// find comment by ID and to set as Complete
const findCommentToSetAsComplete = async (commentId) => {
  try {
    await ArticleComment.findByIdAndUpdate(
      commentId,
      {
        isCompleted: true,
        isCompletedAt: new Date(),
      },
      {
        new: false,
        runValidators: true,
        returnOriginal: false
      }
    );
    return true;
  } catch (err) {
    return false
  } // end catch
} // end function

// find comment by ID and close it
const findCommentToSetAsClosed = async (commentId, closedBy) => {
  try {
    await ArticleComment.findByIdAndUpdate(
      commentId,
      {
        isClosed: true,
        isClosedBy: closedBy,
        isClosedAt: new Date(),
      },
      {
        new: false,
        runValidators: true,
        returnOriginal: false
      }
    );
    return true;
  } catch (err) {
    return false
  } // end catch
} // end function

// find comment by ID and to set reply
const findCommentToSetReply = async (commentId, reply) => {
  try {
    const resultArticleComment = await ArticleComment.findById(commentId);
    await resultArticleComment.replies.addToSet({
      text: reply.text,
      replyBy: reply.replyBy,
      repliedAt: new Date(),
    });
    return true;
  } catch (err) {
    return false
  } // end catch
} // end function