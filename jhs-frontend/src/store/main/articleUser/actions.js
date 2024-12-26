/* eslint-disable */
import { request } from '../../../helpers/request';
import { getArticleEditor, getArticleReviewers } from '../articles/actions';

export const getUnassignedUser = (payload) => async (dispatch) => {
    const response = await request.makeRequest('GET', `${payload.options.id}/getUnassignedUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({
            type: 'SET_MY_ARTICLE_UNASSIGN_USERS',
            payload: response.data,
        });
    }
};

export const assignManagerToArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/makeUserAsManager`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleEditor({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};

export const addEditorUserToArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/addEditorUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleEditor({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};

export const assignArticleToAssignee = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/assignArticleToAssignee`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleEditor({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};
export const unassignUserFromArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/unassignUser`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleEditor({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};

export const assignReviewerToArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/assignReviewer`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleReviewers({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};
export const unassignReviewerFromArticle = (payload) => async (dispatch) => {
    const response = await request.makeRequest('PUT', `${payload.options.id}/unassignReviewer`, payload.body, payload.options);
    if (response.status === 200) {
        dispatch({ type: 'SET_MY_ARTICLE', payload: response.data });
        dispatch(getUnassignedUser({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
        dispatch(getArticleReviewers({ body: {}, options: { id: payload.options.id, btnLoader: true, __module: 'article', } }));
    }
};

