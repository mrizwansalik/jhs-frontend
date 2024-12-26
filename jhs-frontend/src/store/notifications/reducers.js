/* eslint-disable */
const initial = {
    single: null,
    list: null,
    notification: null,
    pagination: null,
    unreadCount: 0,
    announcements: 0,
};
export const toastReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_TOAST':
            return [...state, action.payload];
        case 'REMOVE_TOAST':
            return state.filter((item) => item.id !== action.payload.id);

        default:
            return state;
    }
};
export const notificationReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            const index = state.list.findIndex((notificationList) => notificationList._id === action.payload.notification._id);
            const newArray = [...state.list];
            newArray[index].read_at = action.payload.notification.read_at;
            return {
                ...state,
                single: action.payload.notification,
                list: newArray,
            };
        case 'SET_NOTIFICATIONS':
            return {
                ...state,
                list: action.payload.data.notifications,
                pagination: action.payload.pagination,
                unreadCount: action.payload.unReadCount,
            };
        case 'SET_UNREAD_COUNT':
            return {
                ...state,
                unreadCount: action.payload,
            };
        case 'SET_ANNOUNCEMENT':
            return {
                ...state,
                announcements: action.payload.data.notifications,
            };

        default:
            return state;
    }
};
