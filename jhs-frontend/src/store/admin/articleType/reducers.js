/* eslint-disable */
const initial = {
    list:null,
    single:null,
    selected:null
};
export const articleTypeReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_ARTICLE_TYPE':
            return {
                ...state,
                list: action.payload,
            };
        case 'SET_ARTICLE_TYPE':
            return {
                ...state,
                single: action.payload,
            };
       
        case 'SELECTED_ARTICLE':
            return {
                ...state,
                selected: action.payload,
            };
       
        default:
            return state;
    }
};

