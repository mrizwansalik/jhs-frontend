/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createArticleStatus = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addArticleStatus', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleStatus");
    }
};

export const getAllArticleStatus = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleStatusWithParent', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_ARTICLE_STATUS', payload: response });
    }
};

export const getArticleStatus = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleStatus`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_STATUS', payload: response.data });
    }
};

export const updateArticleStatus = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleStatus");
    }
};