/* eslint-disable */
const initial = {
    list:null,
    single:null
};
export const articleMetaReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_ARTICLE_META':
            return {
                ...state,
                list: action.payload,
                // role:action.payload.role
            };
        case 'SET_ARTICLE_META':
            return {
                ...state,
                single: action.payload,
            };
       
        default:
            return state;
    }
};

