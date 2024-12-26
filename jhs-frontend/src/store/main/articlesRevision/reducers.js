/* eslint-disable */
const initial = {
    list: [],
    single: null,
    selectedReference: null,
    pagination: null,
};
export const articleRevisionReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_ARTICLE_REVISION':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_MY_ARTICLES_REVISIONS':
            return {
                ...state,
                list: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_SINGLE_REVISION_REFERENCE':
            return {
                ...state,
                selectedReference: action.payload,
            };
        case 'SET_SINGLE_REVISION_REFERENCES_TEXT_LIST':
            return {
                ...state,
                singleOldReferenceTextList: action.payload.oldReferenceList,
                singleNewReferenceTextList: action.payload.newReferenceList,
            };
        default:
            return state;
    }
};
