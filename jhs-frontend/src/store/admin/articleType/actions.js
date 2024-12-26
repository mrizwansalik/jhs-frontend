/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createArticleType = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addArticleType', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleType");
    }
};

export const getAllArticleType = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleType', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_ARTICLE_TYPE', payload: response.data });
    }
};

export const getArticleType = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleType`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_TYPE', payload: response.data });
    }
};

export const updateArticleType = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleType");
    }
};