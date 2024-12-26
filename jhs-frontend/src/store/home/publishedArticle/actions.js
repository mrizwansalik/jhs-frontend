/* eslint-disable */
import fileDownload from 'js-file-download';
import { request } from '../../../helpers/request';


export const getPublicArticleType = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getPublicArticleType', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_PUBLISHED_ARTICLE_TYPE', payload: response.data });
    }
};
export const getPublicAuthor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getPublicAuthor', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_PUBLIC_AUTHOR', payload: response.data });
    }
};
export const getCurrentIssuesArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getCurrentIssuesArticles', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_HOME_CURRENT_ISSUES_ARTICLES', payload: response });
    }
};
export const getTrendingCategoriesList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getTrendingCategoriesList', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_HOME_TRENDING_CATEGORIES', payload: response });
    }
};

export const getTrendingKeywords = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getTrendingKeywords', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_TRENDING_KEYWORDS', payload: response.data });
    }
};
export const getArticleList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getArticleList', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_HOME_ARTICLE_LISTING', payload: response });
    }
};

export const getPublishedArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getMyPublishedArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_PUBLISHED_ARTICLES', payload: response });
    }
};
export const getPublishedArticleDetail = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE',
            payload: response.data,
        });
        
        dispatch({
            type: "SET_COMPONENT_LOADING",
            payload: false,
        });
    }
};
export const getPublishedArticleMatrices = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleMatrices`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_MATRICES',
            payload: response.data,
        });
    }
};

export const downloadPDF = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/downloadPDF`, payload.body, payload.options);
    if (response.status === 200) {
        const link = document.createElement('a');
        link.href = import.meta.env.VITE_REACT_APP_URL +'/public'+ response.data?.pdf;
        link.setAttribute('download', response.data?.articleNumber+'.pdf'); // Change the name as needed
        document.body.appendChild(link);
        link.click();
    }
};

export const getPublishedArticleAuthors = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleAuthors`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_AUTHORS',
            payload: response.data,
        });
    }
};
export const getPublishedArticleReviewers = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleReviewers`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_REVIEWER',
            payload: response.data,
        });
    }
};
export const getPublishedArticleReferencesTextList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleReferencesTextList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_REFERENCES_TEXT_LIST',
            payload: response.data,
        });
    }
};

export const getPublishedArticleComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleComment`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_COMMENTS',
            payload: response.data,
        });
    }
};
export const getPublishedArticleCommentReplies = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/getPublishedArticleCommentReplies`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE_COMMENT',
            payload: response.data,
        });
    }
};

export const addPublishedArticleComment = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addPublishedArticleComment`, payload.body, payload.options);
};
export const addPublishedArticleCommentReply = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addPublishedArticleCommentReply`, payload.body, payload.options);
};
export const exportCitation = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/exportCitation`, payload.body, payload.options);
    if (response.status === 200) {
        fileDownload(response.data.citation, `citation.${response.data.citationType}`);
    }
};