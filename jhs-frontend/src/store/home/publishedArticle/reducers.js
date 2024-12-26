
/* eslint-disable */
const initial = {
    list: [],
    currentIssuesList: [],
    trendingCategoriesList: [],
    trendingKeywords: [],
    articleList: [],
    publicAuthor: [],

    single: null,
    singleAuthorList: [],
    singleReviewerList: [],
    singleReferencesTextList: [],
    comments: [],
    commentReplies: null,

    articleTypeList: null,
    pagination: null,

    singleArticleTotalViews: 0,
    singleArticleTotalDownloads: 0,
    singleArticleDateMatrices: [],
    singleArticleCountryMetrics: [],
    singleArticleSaudiRegionMetrics: [],
    singleArticleUAERegionMetrics: [],
    singleArticleQatarRegionMetrics: [],
    singleArticleOmanRegionMetrics: [],
    singleArticleKuwaitRegionMetrics: [],
    singleArticleBahrainRegionMetrics: [],
};
export const homeReducer = (state = initial, action) => {
    switch (action.type) {
        case 'SET_ALL_PUBLISHED_ARTICLE_TYPE':
            return {
                ...state,
                articleTypeList: action.payload,
            };
        case 'SET_PUBLIC_AUTHOR':
            return {
                ...state,
                publicAuthor: action.payload,
            };
        case 'SELECTED_PUBLISHED_ARTICLE_TYPE':
            return {
                ...state,
                selectedArticleType: action.payload,
            };
        case 'SET_HOME_CURRENT_ISSUES_ARTICLES':
            return {
                ...state,
                currentIssuesList: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'SET_HOME_TRENDING_CATEGORIES':
            return {
                ...state,
                trendingCategoriesList: action.payload.data,
            };
        case 'SET_TRENDING_KEYWORDS':
            return {
                ...state,
                trendingKeywords: action.payload,
            };
        case 'SET_HOME_ARTICLE_LISTING':
            return {
                ...state,
                articleList: action.payload.data,
                pagination:action.payload.pagination
            };
        case 'SET_MY_PUBLISHED_ARTICLE':
            return {
                ...state,
                single: action.payload,
            };
        case 'SET_MY_PUBLISHED_ARTICLE_MATRICES':
            return {
                ...state,
                singleArticleTotalViews: action.payload.totalViews,
                singleArticleTotalDownloads: action.payload.totalDownloads,
                singleArticleDateMatrices: action.payload.byDateMatrices,
                singleArticleCountryMetrics: action.payload.countryMatrices,
                singleArticleSaudiRegionMetrics: action.payload.saudiRegionMatrices,
                singleArticleUAERegionMetrics: action.payload.uaeRegionMatrices,
                singleArticleQatarRegionMetrics: action.payload.qatarRegionMatrices,
                singleArticleOmanRegionMetrics: action.payload.omanRegionMatrices,
                singleArticleKuwaitRegionMetrics: action.payload.kuwaitRegionMatrices,
                singleArticleBahrainRegionMetrics: action.payload.bahrainRegionMatrices,
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
        case 'SET_MY_PUBLISHED_ARTICLE_REFERENCES_TEXT_LIST':
            return {
                ...state,
                singleReferencesTextList: action.payload,
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
            
        case 'RESET_MY_PUBLISHED_ARTICLE':
            return {
                ...state,
                single: null,
                singleAuthorList: [],
                singleReviewerList: [],
                singleReferencesTextList: [],
                comments: [],
                commentReplies: null,
                singleArticleTotalViews: 0,
                singleArticleTotalDownloads: 0,
                singleArticleDateMatrices: [],
                singleArticleCountryMetrics: [],
                singleArticleSaudiRegionMetrics: [],
                singleArticleUAERegionMetrics: [],
                singleArticleQatarRegionMetrics: [],
                singleArticleOmanRegionMetrics: [],
                singleArticleKuwaitRegionMetrics: [],
                singleArticleBahrainRegionMetrics: [],
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
