/* eslint-disable */
const initial = {
    list: [],
    single: null,
    singleOldReferenceTextList: null,
    singleNewReferenceTextList: null,
    selectedReference: null,
    pagination: null,
};
export const articleLanguageCorrectionReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_MY_ARTICLE_LANGUAGE_CORRECTION':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_MY_ARTICLES_LANGUAGE_CORRECTIONS':
            return {
                ...state,
                list: action.payload.data,
                pagination: action.payload.pagination
            };
        case 'SET_SINGLE_LANGUAGE_CORRECTION_REFERENCE':
            return {
                ...state,
                selectedReference: action.payload,
            };
        case 'SET_SINGLE_LANGUAGE_CORRECTION_REFERENCES_TEXT_LIST':
            return {
                ...state,
                singleOldReferenceTextList: action.payload.oldReferenceList,
                singleNewReferenceTextList: action.payload.newReferenceList,
            };
        default:
            return state;
    }
};
