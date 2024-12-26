/* eslint-disable */
const initial = {
    list:null,
    single:null,
    pagination:null
};
export const articleStatusReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_ARTICLE_STATUS':
            return {
                ...state,
                list: action.payload.data,
                pagination:action.payload.pagination
                // role:action.payload.role
            };
        case 'SET_ARTICLE_STATUS':
            return {
                ...state,
                single: action.payload,
            };
       
        default:
            return state;
    }
};

