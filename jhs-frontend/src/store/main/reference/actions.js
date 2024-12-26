/* eslint-disable */
import { request } from '../../../helpers/request';

export const addReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/addReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const getReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/getReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const getSpecificReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/${payload.options.referenceId}/getSpecificReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SINGLE_REFERENCE', payload: response.data });
    }
};
export const updateReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/updateReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const generateReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/generateReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};

export const removeReference = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/removeReference`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const updateReferenceSorting = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `${payload.options.id}/updateReferenceSorting`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
