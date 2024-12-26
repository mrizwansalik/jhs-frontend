/* eslint-disable */
import { request } from '../../../helpers/request';

export const searchReviewer = (payload) => async (dispatch) => {
    const response = await request.makeRequest('POST', `searchByEmail`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_SEARCH_REVIEWER_INFORMATION', payload: response.data });
    }
};
export const suggestReviewer = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/suggestReviewer`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_DRAFT_ARTICLE', payload: response.data });
    }
};
export const unSuggestReviewer = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/unSuggestReviewer`, payload.body, payload.options);
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
