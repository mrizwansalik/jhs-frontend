/* eslint-disable */
// Authentication Socket
const chatSocketInit = {
    conn: null,
    status: false,
    config: null,
};
export const ChatSocketReducer = (state = chatSocketInit, action) => {
    switch (action.type) {
        case 'SET_CHAT_SOCKET_CONNECTION':
            return {
                ...state,
                conn: action.payload,
            };
        case 'SET_CHAT_SOCKET_CONFIGURATIONS':
            return {
                ...state,
                config: action.payload,
            };
        case 'SET_CHAT_SOCKET_STATUS':
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};
const articleProcessingInit = {
    conn: null,
    status: false,
    config: null,
};
export const articleProcessingReducer = (state = articleProcessingInit, action) => {
    switch (action.type) {
        case 'SET_ARTICLE_PROCESSING_SOCKET_CONNECTION':
            return {
                ...state,
                conn: action.payload,
            };
        case 'SET_ARTICLE_PROCESSING_SOCKET_CONFIGURATIONS':
            return {
                ...state,
                config: action.payload,
            };
        case 'SET_ARTICLE_PROCESSING_SOCKET_STATUS':
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

const articleDiscussionInit = {
    conn: null,
    status: false,
    config: null,
};
export const articleDiscussionSocketReducer = (state = articleDiscussionInit, action) => {
    switch (action.type) {
        case 'SET_ARTICLE_DISCUSSION_SOCKET_CONNECTION':
            return {
                ...state,
                conn: action.payload,
            };
        case 'SET_ARTICLE_DISCUSSION_SOCKET_CONFIGURATIONS':
            return {
                ...state,
                config: action.payload,
            };
        case 'SET_ARTICLE_DISCUSSION_SOCKET_STATUS':
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

const notificationSocketInit = {
    conn: null,
    status: false,
    config: null,
};
export const NotificationSocketReducer = (state = notificationSocketInit, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION_SOCKET_CONNECTION':
            return {
                ...state,
                conn: action.payload,
            };
        case 'SET_NOTIFICATION_SOCKET_CONFIGURATIONS':
            return {
                ...state,
                config: action.payload,
            };
        case 'SET_NOTIFICATION_SOCKET_STATUS':
            return {
                ...state,
                status: action.payload,
            };
        default:
            return state;
    }
};

