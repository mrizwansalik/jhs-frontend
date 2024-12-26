/* eslint-disable */
const initial = {
    list: [],
    publishList: [],
    draftList: [],
    assignList: [],
    reviewList: [],
    single: null,
    singleReferenceTextList: [],
    singleDraft: null,
    singleDraftReferenceTextList: [],
    selectedReference: null,
    singleAuthorList: [],
    singleReviewerList: [],
    singleEditorList: [],
    comments: [],
    commentReplies: null,
    singleHistory: null,
    pagination: null,
};
export const articleReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_ARTICLES':
            return {
                ...state,
                list: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_MY_PUBLISHED_ARTICLES':
            return {
                ...state,
                publishList: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_MY_DRAFT_ARTICLE':
            return {
                ...state,
                singleDraft: action.payload,
            };
        case 'SET_MY_ARTICLE_REFERENCES_TEXT_LIST':
            return {
                ...state,
                singleReferenceTextList: action.payload,
            };
        case 'SET_MY_DRAFT_ARTICLES':
            return {
                ...state,
                draftList: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_MY_DRAFT_ARTICLE_REFERENCES_TEXT_LIST':
            return {
                ...state,
                singleDraftReferenceTextList: action.payload,
            };

        case 'SET_SINGLE_REFERENCE':
            return {
                ...state,
                selectedReference: action.payload,
            };
        case 'SET_MY_ASSIGNED_ARTICLES':
            return {
                ...state,
                assignList: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_MY_REVIEW_ARTICLES':
            return {
                ...state,
                reviewList: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_MY_ARTICLE':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_MY_ARTICLE_AUTHORS':
            return {
                ...state,
                singleAuthorList: action.payload,
            };
        case 'SET_MY_ARTICLE_REVIEWER':
            return {
                ...state,
                singleReviewerList: action.payload,
            };
        case 'SET_MY_ARTICLE_EDITOR':
            return {
                ...state,
                singleEditorList: action.payload,
            };
        case 'SET_MY_ARTICLE_COMMENTS':
            return {
                ...state,
                comments: action.payload,
            };
        case 'SET_MY_ARTICLE_COMMENT':
            return {
                ...state,
                commentReplies: action.payload,
            };
        case 'SET_ARTICLE_HISTORY':
            return {
                ...state,
                singleHistory: action.payload,
            };
        case 'SET_MY_ARTICLE_DELETED':
            const filteredArray = state.list.filter((articles) => articles._id !== action.payload.result._id)
            const filteredDraftListArray = state.draftList.filter((articles) => articles._id !== action.payload.result._id)
            const filteredAssignListArray = state.assignList.filter((articles) => articles._id !== action.payload.result._id)
            const filteredReviewListArray = state.reviewList.filter((articles) => articles._id !== action.payload.result._id)

            return {
                ...state,
                list: filteredArray,
                draftList: filteredDraftListArray,
                assignList: filteredAssignListArray,
                reviewList: filteredReviewListArray,
            };
        case 'SET_ARTICLE_PROCESSING':
            const articleFilteredArray = state.list.map((data, index) => { return (data._id === action.payload._id ? action.payload : data) });
            const articleFilteredDraftListArray = state.draftList.map((data, index) => { return data._id === action.payload._id ? action.payload : data });
            const articleFilteredAssignListArray = state.assignList.map((data, index) => { return data._id === action.payload._id ? action.payload : data });
            const articleFilteredReviewListArray = state.reviewList.map((data, index) => { return data._id === action.payload._id ? action.payload : data });
            if (state.single?._id === action.payload._id) {
                return {
                    ...state,
                    list: articleFilteredArray,
                    draftList: articleFilteredDraftListArray,
                    assignList: articleFilteredAssignListArray,
                    reviewList: articleFilteredReviewListArray,
                    single: action.payload,
                };
            } else {
                return {
                    ...state,
                    list: articleFilteredArray,
                    draftList: articleFilteredDraftListArray,
                    assignList: articleFilteredAssignListArray,
                    reviewList: articleFilteredReviewListArray,
                };
            }
        case 'PUBLISH_ARTICLE':
            const filteredListAfterPublishedArticle = state.list.filter((data) => data._id !== action.payload.data);
            return {
                ...state,
                list: filteredListAfterPublishedArticle,
            };
        default:
            return state;
    }
};
