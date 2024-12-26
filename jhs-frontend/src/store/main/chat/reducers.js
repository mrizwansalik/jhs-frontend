/* eslint-disable */
const initial = {
    list:[],
    messageList:[],
    single:null,
};
export const chatReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_CHATS':
          return {
                ...state,
                list: action.payload,
            };
        case 'SET_MY_CHAT':
                return {
                    ...state,
                    single: action.payload,
                };
        default:
            return state;
    }
};
