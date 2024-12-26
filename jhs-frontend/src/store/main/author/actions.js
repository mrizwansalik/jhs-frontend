/* eslint-disable */
import { request } from '../../../helpers/request';

export const searchAuthor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `searchByEmail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SEARCH_AUTHOR_INFORMATION', payload: response.data });
    }
};
export const assignAuthor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/assignAuthor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const unAssignAuthor = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/unassignAuthor`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const addPublicUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `addPublicUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_PUBLIC_USER', payload: response.data });
    }
};
