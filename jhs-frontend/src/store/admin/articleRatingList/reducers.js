/* eslint-disable */
const initial = {
    publicList:[],
    list:[],
    single:null,
};
export const articleRatingListReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_PUBLIC_ARTICLE_RATING_LIST':
          return {
                ...state,
                publicList: action.payload,
            };
        case 'SET_ARTICLE_RATING_LIST':
          return {
                ...state,
                list: action.payload,
            };
        case 'SET_ARTICLE_RATING_LIST_ITEM':
                return {
                    ...state,
                    single: action.payload,
                };
        case 'SET_ARTICLE_RATING_LIST_ITEM_STATUS':
            const index = state.list.findIndex(categories => categories._id === action.payload._id);
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
