/* eslint-disable */
const initial = {
    single:null,
    list:null
};
export const userReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_USERS':
            return {
                ...state,
                list: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'POST_USER':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_USER_STATUS':
            const index = state.list.findIndex(usersList => usersList._id === action.payload._id);
            const newArray = [...state.list];
            newArray[index].active = action.payload.active;
            return {
                ...state,
                list: newArray,
            };
            
        default:
            return state;
    }
};

