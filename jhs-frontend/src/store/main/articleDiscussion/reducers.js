/* eslint-disable */
export const initialState = {
  types: [], // general, Authors Discussion, Reviewer Discussion, Author Editor Discussion, Reviewer Editor Discussion 
  replies: [], // replies
  isTyping: { // is typing by type
    sender: null,
    typing: false
  },
  connectedUsers: null, // assigned users
};

export const articleDiscussionReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ARTICLE_DISCUSSION_TYPE':
      return {
        ...state,
        types: action.payload.types,
      };
    case 'SET_ARTICLE_DISCUSSION_REPLY':
      return {
        ...state,
        replies: action.payload.replies,
      };
    case 'RESET_ARTICLE_DISCUSSION_REPLY':
      return {
        ...state,
        replies: action.payload,
      };
    case 'ARTICLE_DISCUSSION_TYPING':
      return {
        ...state,
        isTyping: { typing: action.payload.isTyping, sender: action.payload.sender },
      };
    case 'PING':
      return {
        ...state,
        connectedUsers: action.payload.connectedUsers,
      };
    case 'SEEN_ARTICLE_DISCUSSION_REPLY':
      const indexes = state.replies.reduce((acc, element, index) => {
        if (element.senderId === action.payload.receiverId && element.receiverId === action.payload.sender && element.lastMessageViewed === null) {
          acc.push(index);
        }
        return acc;
      }, []);
      if (indexes.length > 0) {
        const newRepliesList = [...state.replies];
        indexes.map((value) => {
          newRepliesList[value].lastMessageViewed = action.payload.lastMessageViewed
          return;
        });
        return {
          ...state,
          replies: newRepliesList,
        };
      } else {
        return {
          ...state,
          replies: state.replies
        }
      };
    case 'SEND_ARTICLE_DISCUSSION_REPLY':
      const user = JSON.parse(localStorage.getItem('auth'));
      let newReplies = [...state.replies];
      newReplies.push({
        uuid: action.payload.uuid,
        sender: action.payload.sender,
        message: action.payload.message,
        createdAt: action.payload.createdAt,
        type: action.payload.type
      });
      return {
        ...state,
        replies: newReplies,
        // list:newArray,
        isTyping: false
      };
    default:
      return state;
  }
};

