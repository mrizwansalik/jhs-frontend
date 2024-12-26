/* eslint-disable */
const initial = {
    singleUnassignUser: [],
};

export const articleUserReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_ARTICLE_UNASSIGN_USERS':
            return {
                ...state,
                singleUnassignUser: action.payload,
            };
            
        default:
            return state;
    }
};
