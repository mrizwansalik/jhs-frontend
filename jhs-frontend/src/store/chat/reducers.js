/* eslint-disable */
export const initialState = {
  single: null,
  list: [],
  messages: [],
  isTyping: {
    sender: null,
    typing: false
  },
  connectedUsers: null
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CHAT_USERS':   
      return {
        ...state,
        list: action.payload.users,
      };
    case 'SET_CHAT':
      return {
        ...state,
        messages: action.payload.allMessages,
      };
    case 'RESET_CHAT':
      return {
        ...state,
        messages: action.payload,
      };
    case 'TYPING':
      return {
        ...state,
        isTyping: { typing: action.payload.isTyping, sender: action.payload.sender },
      };
    case 'PING':
      return {
        ...state,
        connectedUsers:action.payload.connectedUsers,
      };
    case 'SEEN_MESSAGE':
      //const index = state.messages.findIndex((msg) => msg.uuid === action.payload.lastMessageViewed && msg.lastMessageViewed ==null);
      const indexes = state.messages.reduce((acc, element, index) => {
        if (element.senderId === action.payload.receiverId && element.receiverId === action.payload.sender && element.lastMessageViewed ===null ) {
          acc.push(index);
        }
        return acc;
      }, []);
      // const userIndex = state.list.findIndex((user) => user.user._id === action.payload.receiverId || user.user._id === action.payload.sender);
     if(indexes.length>0){
      const newMsgList = [...state.messages];
      indexes.map((value)=>{
        newMsgList[value].lastMessageViewed = action.payload.lastMessageViewed
        return;
      });
      return {
        ...state,
        messages:newMsgList,
        // list:newUsersList,
      };
    }else{
      return{
        ...state,
        messages:state.messages
      }
    }
  
    case 'SEND_MESSAGE':
      //------------ push new message in the list responded by socket ----------//
      const user = JSON.parse(localStorage.getItem('auth'));
      let newList = [...state.messages];
      newList.push({
        uuid:action.payload.uuid,
        lastMessageViewed:null,
        message: action.payload.message,
        senderId: action.payload.sender,
        receiverId: action.payload.receiverId,
        createdAt: action.payload.createdAt,
        myself: user.user.id === action.payload.sender ? true : false,
        type:action.payload.type
      });
      return {
        ...state,
        messages: newList,
        // list:newArray,
        isTyping: false
      };
    // }
    default:
      return state;
  }
};

