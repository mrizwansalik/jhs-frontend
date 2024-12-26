/* eslint-disable */
import { request } from '../../../helpers/request';

export const addRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/addRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
export const getRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/getRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
export const getSpecificRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/${payload.options.referenceId}/revision/getSpecificRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SINGLE_REVISION_REFERENCE', payload: response.data });
    }
};
export const updateRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/updateRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
export const generateRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/generateRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};

export const removeRevisionReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/removeRevisionReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
export const updateRevisionReferenceSorting = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/revision/updateRevisionReferenceSorting`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE_REVISION', payload: response.data });
    }
};
