/* eslint-disable */
const initial = {
    list: [],
    single: null,
    singleAuthorList: [],
    singleReviewerList: [],
    comments: [],
    commentReplies: null,
    pagination: null,
};
export const publishedArticleReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_PUBLISHED_ARTICLES':
            return {
                ...state,
                list: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'SET_MY_PUBLISHED_ARTICLE':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_MY_PUBLISHED_ARTICLE_AUTHORS':
            return {
                ...state,
                singleAuthorList: action.payload,
            };
        case 'SET_MY_PUBLISHED_ARTICLE_REVIEWER':
            return {
                ...state,
                singleReviewerList: action.payload,
            };
        case 'SET_MY_PUBLISHED_ARTICLE_COMMENTS':
            return {
                ...state,
                comments: action.payload,
            };
        case 'SET_MY_PUBLISHED_ARTICLE_COMMENT':
            return {
                ...state,
                commentReplies: action.payload,
            };
        case 'SET_PUBLISHED_ARTICLE_PROCESSING':
            const articleFilteredArray = state.list.map((data, index) => { return (data._id === action.payload._id ? action.payload : data) });
            if (state.single?._id === action.payload._id) {
                return {
                    ...state,
                    list: articleFilteredArray,
                    single: action.payload,
                };
            } else {
                return {
                    ...state,
                    list: articleFilteredArray,
                };
            }
        default:
            return state;
    }
};
