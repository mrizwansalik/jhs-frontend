/* eslint-disable */
import fileDownload from 'js-file-download';
import { request } from '../../../helpers/request';

export const getPublicArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getMyPublishedArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_PUBLISHED_ARTICLES', payload: response });
    }
};
export const getPublishedArticles = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getMyPublishedArticle', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_PUBLISHED_ARTICLES', payload: response });
    }
};
export const getPublishedArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getPublishedArticleDetail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_PUBLISHED_ARTICLE',
            payload: response.data,
        });
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

export const addArticleRating = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addArticleRating`, payload.body, payload.options);
    if (response.status === 200) {
        console.log("addArticleRating");
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