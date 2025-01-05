/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getPublicArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'all', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_PUBLIC_ARTICLE_RATING_LIST', payload: response.data });
    }
};

export const getAllArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleRatingList', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_RATING_LIST', payload: response.data });
    }
};

export const getArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleRatingList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_ARTICLE_RATING_LIST_ITEM',
            payload: response.data,
        });
    }
};

export const addArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addArticleRatingList', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/articleRatingList')
    }
};
export const updateArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/articleRatingList')
    }
};
export const deactivateArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateArticleRatingList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_RATING_LIST_ITEM_STATUS', payload: response.data });
    }
};
export const activateArticleRatingList = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateArticleRatingList`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_RATING_LIST_ITEM_STATUS', payload: response.data });
    }
};