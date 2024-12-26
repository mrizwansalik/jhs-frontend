/* eslint-disable */
const initial = {
    list:null,
    single:null,
    search:null,
    publicUser:null
};
export const authorReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_SEARCH_AUTHOR_INFORMATION':
          return {
                ...state,
                search: action.payload,
            };
        case 'ASSIGN_AUTHOR_INFORMATION':
                return {
                    ...state,
                    single: action.payload,
                };
        case 'SET_PUBLIC_USER':
                return {
                    ...state,
                    publicUser: action.payload,
                };
        case 'DELETE_ARTICLE_DELETED':
            const index = state.list.findIndex(author => author._id === action.payload._id);
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
