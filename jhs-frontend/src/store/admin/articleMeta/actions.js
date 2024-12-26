/* eslint-disable */
import { History } from '../../../routes/NavigationSetter';
import { request } from '../../../helpers/request';

export const createArticleMeta = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addArticleMeta', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleMeta");
    }
};

export const getAllArticleMeta = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllArticleMeta', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ALL_ARTICLE_META', payload: response.data });
    }
};

export const getArticleMeta = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getArticleMeta`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_ARTICLE_META', payload: response.data });
    }
};

export const updateArticleMeta = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate("/system/articleMeta");
    }
};