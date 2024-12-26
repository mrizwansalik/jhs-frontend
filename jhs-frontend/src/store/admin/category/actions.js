/* eslint-disable */
import { request } from '../../../helpers/request';
import { History } from '../../../routes/NavigationSetter';

export const getPublicCategories = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'all', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    }
};

export const getCategories = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', 'getAllCategory', payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_CATEGORIES', payload: response.data });
    }
};

export const getCategory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getCategory`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_CATEGORY',
            payload: response.data,
        });
    }
};

export const addCategory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', 'addCategory', payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/category')
    }
};
export const updateCategory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/update`, payload.body, payload.options);
    if (response.status === 200) {
        History.navigate('/system/category')
    }
};
export const deactivateCategory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/deactivateCategory`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_CATEGORY_STATUS', payload: response.data });
    }
};
export const activateCategory = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/activateCategory`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_CATEGORY_STATUS', payload: response.data });
    }
};